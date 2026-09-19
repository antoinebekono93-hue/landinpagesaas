#!/usr/bin/env node
/**
 * Backfill des vignettes catalogue déjà en base.
 *
 * Pourquoi ?
 * ----------
 * Les 5 produits présents ont `thumbnail_url = NULL`. Cause : la `normalize()`
 * historique lisait `item.thumbnail_urls` (forme *search* Envato), qui n'existe pas
 * sur la forme *catalog item*. La lib lit désormais `getBestEnvatoImage(item)`
 * (priorité landscape → large → square → thumbnail → item.thumbnail_url → null,
 * gère `previews` objet OU tableau). Ce script re-traite UNIQUEMENT les produits
 * dont `thumbnail_url` est NULL/vide : re-fetch de l'item, meilleure image, et
 * mise à jour du champ EXISTANT `thumbnail_url` (aucun doublon de colonne, aucune
 * colonne `preview_images` — absente du schéma Nhost confirmé par introspection).
 *
 * Sécurité (respectée, jamais loggée) :
 * - Lit `ENVATO_API_TOKEN` / `NHOST_ADMIN_SECRET` depuis `.env.local` (serveur).
 * - N'affiche JAMAIS le token, ni une partie de celui-ci, ni le header Authorization,
 *   ni le secret. Seuls : statuts HTTP, compteurs, URLs d'images Envato (sans
 *   credentials).
 * - Rate-limit Envato (429 → retry-after) + timeout 30s par item.
 */

import { readFileSync } from "node:fs";

/* ─────────────────────────── config (.env.local) ─────────────────────────── */

const env = Object.create(null);
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const eq = line.indexOf("=");
  if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
}

const ENVATO_TOKEN = env.ENVATO_API_TOKEN;
const ADMIN_SECRET = env.NHOST_ADMIN_SECRET;
const NHOST_SUB = env.NEXT_PUBLIC_NHOST_SUBDOMAIN;
const NHOST_REGION = env.NEXT_PUBLIC_NHOST_REGION;

const HASURA_URL = `https://${NHOST_SUB}.hasura.${NHOST_REGION}.nhost.run/v1/graphql`;

const LIMIT = Number(process.env.BACKFILL_LIMIT ?? "50");
const DELAY_MS = Number(process.env.BACKFILL_DELAY_MS ?? "1100");

if (!ENVATO_TOKEN || !ADMIN_SECRET || !NHOST_SUB || !NHOST_REGION) {
  console.log("MISSING_CONFIG (.env.local : ENVATO_API_TOKEN + NHOST_ADMIN_SECRET + subdomain + region)");
  process.exit(1);
}

/* ─────────────────────────────── helpers ─────────────────────────────── */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function hasura(query, variables = {}) {
  const res = await fetch(HASURA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": ADMIN_SECRET,
      "x-hasura-role": "admin",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HASURA_HTTP_${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(`HASURA_ERR_${String(json.errors[0].message).slice(0, 70)}`);
  return json.data;
}

async function envatoItem(id) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30_000);
  try {
    const res = await fetch(
      `https://api.envato.com/v3/market/catalog/item?id=${encodeURIComponent(String(id))}`,
      {
        headers: {
          Authorization: `Bearer ${ENVATO_TOKEN}`,
          Accept: "application/vnd.api+json",
        },
        signal: ctrl.signal,
        cache: "no-store",
      }
    );
    if (res.status === 429) {
      let wait = 60;
      try { wait = Number(res.headers.get("retry-after")) || 60; } catch { /* ignore */ }
      throw new Error(`RATE_LIMITED_wait=${wait}s`);
    }
    if (!res.ok) throw new Error(`ENVATO_HTTP_${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Même priorité que getBestEnvatoImage (lib/envato/client.ts). */
function bestEnvatoImage(item) {
  const previews = Array.isArray(item?.previews)
    ? item.previews
    : Object.values(item?.previews ?? {});
  const priority = ["landscape_url", "large_url", "square_url", "thumbnail_url"];
  for (const key of priority) {
    for (const preview of previews) {
      const v = preview?.[key];
      if (typeof v === "string" && v.trim().length > 0) return v.trim();
    }
  }
  if (typeof item?.thumbnail_url === "string" && item.thumbnail_url.trim().length > 0) {
    return item.thumbnail_url.trim();
  }
  return null;
}

/* ──────────────────────────────── main ──────────────────────────────── */

console.log("=== Backfill vignettes catalogue (thumbnail_url = NULL/vide) ===");
console.log(`mode=re-fetch_item_envato | priorite=landscape→large→square→thumbnail→item.thumbnail_url | limite=${LIMIT}`);

const { catalog_products: missing } = await hasura(
  `query GetMissing($limit: Int!) {
    catalog_products(
      limit: $limit
      where: { _or: [{ thumbnail_url: { _is_null: true } }, { thumbnail_url: { _eq: "" } }] }
    ) {
      id
      envato_item_id
      title
    }
  }`,
  { limit: LIMIT }
);

if (!missing?.length) {
  console.log("À_JOUR : aucun produit sans vignette.");
  process.exit(0);
}
console.log(`produits_a_rettraiter=${missing.length}`);

let updated = 0;
let failed = 0;
let skipped = 0;

for (const p of missing) {
  if (!p.envato_item_id) {
    console.log(`  SKIP ${p.title} (pas d'envato_item_id)`);
    skipped += 1;
    continue;
  }
  let d;
  try {
    d = await envatoItem(p.envato_item_id);
  } catch (e) {
    console.log(`  ERR  ${p.title} => ${e.message}`);
    failed += 1;
    await sleep(DELAY_MS);
    continue;
  }
  const best = bestEnvatoImage(d);
  if (!best) {
    console.log(`  RIEN ${p.title} (aucun preview exploitable)`);
    skipped += 1;
    await sleep(DELAY_MS);
    continue;
  }
  try {
    const data = await hasura(
      `mutation SetImage($id: uuid!, $url: String!) {
        update_catalog_products(
          where: { id: { _eq: $id } }
          _set: { thumbnail_url: $url }
        ) {
          affected_rows
        }
      }`,
      { id: p.id, url: best }
    );
    const affected = data?.update_catalog_products?.affected_rows ?? 0;
    console.log(`  OK   ${p.title} | affected=${affected} | ${best.slice(0, 130)}`);
    updated += 1;
  } catch (e) {
    console.log(`  ERR  ${p.title} => ${e.message}`);
    failed += 1;
  }
  await sleep(DELAY_MS);
}

console.log("─".repeat(70));
console.log(`résultat updated=${updated} failed=${failed} skipped=${skipped} total_produits=${missing.length}`);
console.log("prochaine étape : vérifier visuellement /creer-saas/catalogue (vignettes affichées), puis décider du push.");
