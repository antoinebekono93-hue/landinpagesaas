#!/usr/bin/env node
/**
 * Sync contrôlée : 1 catégorie, 1 query, max 10 résultats.
 * Standalone (pas d'import server-only) — appelle directement les APIs.
 */
import { readFileSync } from "fs";

const env = {};
readFileSync(".env.local", "utf8").split("\n").forEach((l) => {
  const i = l.indexOf("=");
  if (i > 0) env[l.substring(0, i).trim()] = l.substring(i + 1).trim();
});

const ENVATO_TOKEN = env.ENVATO_API_TOKEN;
const NHOST_SUB = env.NEXT_PUBLIC_NHOST_SUBDOMAIN;
const NHOST_REGION = env.NEXT_PUBLIC_NHOST_REGION;
const ADMIN_SECRET = env.NHOST_ADMIN_SECRET;
const HASURA_URL = `https://${NHOST_SUB}.hasura.${NHOST_REGION}.nhost.run/v1/graphql`;
const MAX_ITEMS = parseInt(process.env.SYNC_MAX_ITEMS || "10", 10);

if (!ENVATO_TOKEN || !ADMIN_SECRET || !NHOST_SUB) {
  console.log("MISSING_CONFIG");
  process.exit(1);
}

const CATEGORY = process.env.SYNC_CATEGORY || "crm-sales";
const SEARCH_TERM = process.env.SYNC_TERM || "crm saas";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function envatoGet(path, timeoutMs = 30000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`https://api.envato.com${path}`, {
      headers: { Authorization: `Bearer ${ENVATO_TOKEN}`, Accept: "application/vnd.api+json" },
      signal: ctrl.signal,
      cache: "no-store",
    });
    if (res.status === 429) {
      const ra = Number(res.headers.get("retry-after")) || 60;
      throw new Error(`RATE_LIMITED wait=${ra}s`);
    }
    if (!res.ok) throw new Error(`HTTP_${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function hasura(query, variables = {}) {
  const res = await fetch(HASURA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-hasura-admin-secret": ADMIN_SECRET },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  const body = await res.json();
  if (body.errors?.length) throw new Error(`HASURA: ${body.errors[0].message}`);
  return body.data;
}

function slugify(value, id) {
  const n = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  return n || `candidat-${id}`;
}

function stripHtml(v) { return (v || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 3000); }

const TECH_KW = [
  ["laravel", "Laravel"], ["react", "React"], ["vue", "Vue"], ["node", "Node.js"],
  ["next.js", "Next.js"], ["php", "PHP"], ["flutter", "Flutter"], ["wordpress", "WordPress"],
  ["tailwind", "Tailwind"], ["mysql", "MySQL"], ["postgres", "PostgreSQL"],
];

function detectTech(item) {
  const h = [item.name, item.classification, (item.tags||[]).join(" "),
    stripHtml(item.description_html || item.description),
    (item.attributes||[]).map(a => `${a.name} ${a.value}`).join(" ")
  ].join(" ").toLowerCase();
  return [...new Set(TECH_KW.filter(([k]) => h.includes(k)).map(([,s]) => s))].slice(0, 8);
}

function normalize(item, catKey, id) {
  const prices = (item.prices || []).map(p => Number(p.amount)).filter(n => Number.isFinite(n) && n > 0).sort((a,b) => a-b);
  const regular = prices[0] ?? (typeof item.price_cents === "number" ? Math.round(item.price_cents) / 100 : null);
  const extended = prices.length > 1 ? prices[prices.length - 1] : null;
  const desc = stripHtml(item.description_html || item.description || item.name || "");
  const tags = (item.tags || []).map(String).slice(0, 12);
  const hay = [item.name, item.classification, tags.join(" "), desc].join(" ").toLowerCase();
  const multiTenant = /multi[-\s]?tenant|multitenanc|subscri(ption|bable|ber)/.test(hay) ? "needs-audit" : "unknown";
  const whiteLabel = /white[-\s]?label/.test(hay) ? "needs-audit" : "unknown";
  const saas = /\bsaas\b/.test(hay) || multiTenant === "needs-audit";

  return {
    envato_item_id: String(id),
    slug: slugify(item.name || "", String(id)),
    title: item.name || `Item ${id}`,
    author: item.author_username || null,
    description: desc || item.name || `Item ${id}`,
    category_key: catKey,
    envato_category: item.classification || null,
    product_url: item.url || `https://codecanyon.net/item/${id}`,
    preview_url: item.live_preview_url || item.preview_url || null,
    thumbnail_url: item.thumbnail_urls?.["icon_2x_retina"] || item.thumbnail_urls?.["icon_retina"] || null,
    regular_price_usd: regular,
    extended_price_usd: extended,
    sales_count: typeof item.number_of_sales === "number" ? item.number_of_sales : null,
    rating: typeof item.rating === "number" ? item.rating : null,
    rating_count: typeof item.rating_count === "number" ? item.rating_count : null,
    published_at: item.published_at || null,
    updated_at_envato: item.updated_at || null,
    tech_stack: detectTech(item),
    tags,
    target_customers: [],
    features: [],
    dependencies: [],
    external_costs: [],
    multi_tenant_status: multiTenant,
    white_label_status: whiteLabel,
    saas_candidate: saas,
    saas_score: 0,
  };
}

function scoreProduct(p) {
  let s = 30;
  if (p.sales_count && p.sales_count > 50) s += 10;
  if (p.sales_count && p.sales_count > 200) s += 10;
  if (p.rating && p.rating >= 4) s += 10;
  if (p.rating_count && p.rating_count > 20) s += 5;
  if (p.tech_stack.length >= 2) s += 5;
  if (p.saas_candidate) s += 15;
  if (p.multi_tenant_status === "needs-audit") s += 10;
  if (p.white_label_status === "needs-audit") s += 5;
  return Math.min(100, Math.max(0, s));
}

async function main() {
  console.log(`sync_start category=${CATEGORY} term="${SEARCH_TERM}" max=${MAX_ITEMS}`);

  // 1. Search Envato
  const qs = new URLSearchParams({ term: SEARCH_TERM, site: "codecanyon.net", page_size: String(MAX_ITEMS) });
  const search = await envatoGet(`/v1/discovery/search/search/item?${qs}`);
  const items = (search.matches || []).filter(i => {
    const url = (i.url || "").toLowerCase();
    return url.includes("codecanyon.net");
  }).slice(0, MAX_ITEMS);
  console.log(`envato_search found=${items.length} total=${search.total_count || 0}`);

  if (items.length === 0) { console.log("NO_ITEMS"); return; }

  // 2. Fetch details + normalize
  const products = [];
  for (const item of items) {
    let detail = item;
    try {
      const d = await envatoGet(`/v3/market/catalog/item?id=${item.id}`);
      if (d) detail = d;
    } catch (e) {
      console.log(`detail_skip id=${item.id} ${e.message}`);
    }
    const normalized = normalize(detail, CATEGORY, item.id);
    normalized.saas_score = scoreProduct(normalized);
    products.push(normalized);
    await sleep(200);
  }
  console.log(`normalized=${products.length} products`);

  // 3. Upsert to Hasura
  let created = 0, updated = 0, unchanged = 0;
  for (const p of products) {
    const check = await hasura(
      `query Check($eid: String!) {
        catalog_products(where: { envato_item_id: { _eq: $eid } }) { id saas_score }
      }`,
      { eid: p.envato_item_id }
    );
    const existing = check.catalog_products?.[0];

    const upsertCols = [
      "envato_item_id", "slug", "title", "author", "description", "category_key",
      "envato_category", "product_url", "preview_url", "thumbnail_url",
      "regular_price_usd", "extended_price_usd", "sales_count", "rating", "rating_count",
      "published_at", "updated_at_envato", "tech_stack", "tags", "target_customers",
      "features", "dependencies", "external_costs", "multi_tenant_status",
      "white_label_status", "saas_candidate", "saas_score",
      "last_synced_at",
    ];

    if (existing) {
      if (existing.saas_score === p.saas_score && !p.saas_candidate) {
        unchanged++;
        continue;
      }
      await hasura(
        `mutation Update($eid: String!, $set: catalog_products_set_input!) {
          update_catalog_products(where: { envato_item_id: { _eq: $eid } }, _set: $set) { affected_rows }
        }`,
        { eid: p.envato_item_id, set: { ...p, last_synced_at: new Date().toISOString() } }
      );
      updated++;
    } else {
      const updateColsEnum = upsertCols.join(", ");
      await hasura(
        `mutation Insert($objects: [catalog_products_insert_input!]!) {
          insert_catalog_products(objects: $objects, on_conflict: {
            constraint: catalog_products_envato_item_id_key,
            update_columns: [${updateColsEnum}]
          }) { affected_rows }
        }`,
        { objects: [{ ...p, last_synced_at: new Date().toISOString() }] }
      );
      created++;
    }
  }

  // 4. Log sync run
  const now = new Date().toISOString();
  await hasura(
    `mutation LogRun($obj: catalog_sync_runs_insert_input!) {
      insert_catalog_sync_runs_one(object: $obj) { id }
    }`,
    {
      obj: {
        started_at: now, finished_at: now, status: "success",
        queries_count: 1, items_received: products.length,
        items_created: created, items_updated: updated, items_unchanged: unchanged,
        items_failed: 0, rate_limits: 0,
      },
    }
  );

  console.log(`sync_done created=${created} updated=${updated} unchanged=${unchanged}`);
}

main().catch((e) => { console.log(`sync_error ${e.message}`); process.exit(1); });
