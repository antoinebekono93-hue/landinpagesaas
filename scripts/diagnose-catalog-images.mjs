#!/usr/bin/env node
/**
 * Diagnostic images catalogue — CLI SERVER-ONLY (aucune route publique).
 *
 * Objectif : comprendre pourquoi thumbnail_url est null/placeholder en base.
 * 1. Introspection Hasura des colonnes de catalog_products (existence de
 *    source_thumbnail_url / preview_images).
 * 2. 5 produits présents dans Nhost (envato_item_id, title, thumbnail_url,
 *    preview_url).
 * 3. Pour chaque produit muni d'un envato_item_id (et pour l'item WhatsCRM
 *    connue), appel GET officiel /v3/market/catalog/item?id= et inspection de
 *    thumbnail_url + previews[].type/href/small_url/large_url/landscape_url/
 *    square_url/thumbnail_url.
 *
 * SÉCURITÉ (jamais violée) :
 * - Lit UNIQUEMENT .env.local en local : ENVATO_API_TOKEN, NHOST_ADMIN_SECRET,
 *   NEXT_PUBLIC_NHOST_SUBDOMAIN, NEXT_PUBLIC_NHOST_REGION.
 * - N'AFFICHE JAMAIS : le token, ni une partie, ni le header Authorization,
 *   ni une variable d'environnement secrète. Statuts HTTP + champs publics.
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

if (!ENVATO_TOKEN || !ADMIN_SECRET || !NHOST_SUB) {
  console.log("MISSING_CONFIG");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

async function envatoItem(id) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch(
      `https://api.envato.com/v3/market/catalog/item?id=${encodeURIComponent(String(id))}`,
      { headers: { Authorization: `Bearer ${ENVATO_TOKEN}`, Accept: "application/vnd.api+json" }, signal: ctrl.signal, cache: "no-store" }
    );
    if (res.status === 429) {
      const ra = Number(res.headers.get("retry-after")) || 60;
      throw new Error(`RATE_LIMITED wait=${ra}s`);
    }
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { __raw_prefix: text.slice(0, 120) };
    }
    return { status: res.status, data };
  } finally {
    clearTimeout(timer);
  }
}

// Priorité demandée par la spec : landscape → large → square → thumbnail → item.thumbnail_url → null.
function bestEnvatoImage(item) {
  const previews = Array.isArray(item?.previews) ? item.previews : [];
  for (const key of ["landscape_url", "large_url", "square_url", "thumbnail_url"]) {
    for (const preview of previews) {
      const value = preview?.[key];
      if (typeof value === "string" && value.trim().length > 0) return value.trim();
    }
  }
  if (typeof item?.thumbnail_url === "string" && item.thumbnail_url.trim().length > 0) {
    return item.thumbnail_url.trim();
  }
  return null;
}

async function main() {
  console.log("=== 1. Colonnes catalog_products (introspection) ===");
  const schema = await hasura(`query { __type(name: "catalog_products") { fields { name } } }`);
  const columns = (schema?.__type?.fields || []).map((f) => f.name).sort();
  const columnSet = new Set(columns);
  console.log(`colonnes=${columns.length}`);
  for (const name of ["thumbnail_url", "preview_url", "source_thumbnail_url", "preview_images"]) {
    console.log(`  ${name}: ${columnSet.has(name) ? "PRESENT" : "ABSENT"}`);
  }

  console.log("\n=== 2. 5 produits présents en base ===");
  const products =
    (await hasura(
      `query GetFive {
        catalog_products(order_by: [{ saas_score: desc }], limit: 5) {
          envato_item_id
          title
          thumbnail_url
          preview_url
        }
      }`
    ))?.catalog_products || [];

  console.log(`produits=${products.length}`);
  for (const p of products) {
    console.log(`  - ${p.title} | item_id=${p.envato_item_id} | thumbnail=${p.thumbnail_url || "NULL"} | preview=${p.preview_url || "NULL"}`);
  }

  console.log("\n=== 3. Appel Envato catalog item (détail réel) ===");
  const ids = [...new Set(products.map((p) => p.envato_item_id).filter(Boolean))];
  if (products.length < 5 || !ids.includes("51122205")) {
    console.log("  (ajout item WhatsCRM 51122205 à sonder)");
    if (!ids.includes("51122205")) ids.push("51122205");
  }
  if (ids.length === 0) {
    console.log("(aucun envato_item_id en base — rien à sonder)");
    return;
  }

  for (const id of ids) {
    await sleep(300);
    let raw;
    try {
      raw = await envatoItem(id);
    } catch (e) {
      console.log(`  item ${id}: ${e.message}`);
      continue;
    }
    const status = raw?.status ?? 0;
    if (status !== 200) {
      console.log(`  item ${id}: HTTP ${status}`);
      continue;
    }
    const d = raw?.data ?? {};
    const topKeys = Object.keys(d).sort().join(", ") || "(vide)";
    const previews = Array.isArray(d?.previews) ? d.previews : [];
    console.log(`  item ${id} | HTTP ${status} | clés=(${topKeys}) | previews=${Array.isArray(d?.previews) ? "ARRAY(" + previews.length + ")" : "NON-ARRAY"}`);
    if (!Array.isArray(d?.previews)) {
      console.log(`    PREVIEWS_BRUT=${JSON.stringify(d?.previews).slice(0, 1200)}`);
      console.log(`    THUMB_valeur=${JSON.stringify(d?.thumbnail_url ?? null)}`);
      console.log(`    PICTURES_valeur=${JSON.stringify(d?.pictures ?? null).slice(0, 600)}`);
    }
    for (let i = 0; i < previews.length; i += 1) {
      const pr = previews[i] || {};
      console.log(
        `    preview[${i}]: ${JSON.stringify(pr).slice(0, 500)}`
      );
    }
    console.log(`    BEST (spec): ${bestEnvatoImage(d) || "NULL"}`);
    console.log("");
  }
}

main().catch((e) => { console.log(`diag_error ${e.message}`); process.exit(1); });