#!/usr/bin/env node
/**
 * Fetch les thumbnails Envato pour les 40 produits du catalogue statique
 * et les injecte dans lib/saas-research-catalog.ts (champ thumbnailUrl).
 *
 * Sécurité : lit .env.local (token/secret jamais loggués), affiche uniquement
 * statuts HTTP et compteurs.
 */
import { readFileSync, writeFileSync } from "node:fs";

const env = Object.create(null);
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const eq = line.indexOf("=");
  if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
}
const ENVATO_TOKEN = env.ENVATO_API_TOKEN;
if (!ENVATO_TOKEN) { console.log("MISSING_ENVATO_TOKEN"); process.exit(1); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function bestImage(d) {
  const previews = Array.isArray(d?.previews) ? d.previews : Object.values(d?.previews ?? {});
  for (const key of ["landscape_url", "large_url", "square_url", "thumbnail_url"]) {
    for (const p of previews) {
      const v = p?.[key];
      if (typeof v === "string" && v.trim().length > 0) return v.trim();
    }
  }
  if (typeof d?.thumbnail_url === "string" && d.thumbnail_url.trim().length > 0) return d.thumbnail_url.trim();
  return null;
}

async function fetchItem(id) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch(`https://api.envato.com/v3/market/catalog/item?id=${id}`, {
      headers: { Authorization: `Bearer ${ENVATO_TOKEN}`, Accept: "application/vnd.api+json" },
      signal: ctrl.signal, cache: "no-store",
    });
    if (res.status === 429) { const w = Number(res.headers.get("retry-after")) || 60; throw new Error(`RATE_${w}`); }
    if (!res.ok) throw new Error(`HTTP_${res.status}`);
    return await res.json();
  } finally { clearTimeout(timer); }
}

const FILE = "lib/saas-research-catalog.ts";
let content = readFileSync(FILE, "utf8");

const urlPattern = /productUrl:\s*"(https:\/\/codecanyon\.net\/item\/[^"]+\/(\d+))"/g;
const entries = [];
let match;
while ((match = urlPattern.exec(content)) !== null) {
  entries.push({ fullMatch: match[0], url: match[1], itemId: match[2], pos: match.index });
}
console.log(`produits_a_traiter=${entries.length}`);

const thumbMap = new Map();
let ok = 0, fail = 0;
for (const e of entries) {
  if (thumbMap.has(e.itemId)) continue;
  try {
    const d = await fetchItem(e.itemId);
    const url = bestImage(d);
    if (url) { thumbMap.set(e.itemId, url); ok++; console.log(`  OK   ${e.itemId} => ${url.slice(0, 90)}`); }
    else { fail++; console.log(`  NULL ${e.itemId} (aucun preview)`); }
  } catch (err) { fail++; console.log(`  ERR  ${e.itemId} => ${err.message}`); }
  await sleep(1100);
}

console.log(`\nfetch_done ok=${ok} fail=${fail}`);

if (ok === 0) { console.log("RIEN_A_INJECTER"); process.exit(0); }

let injected = 0;
for (const e of [...entries].reverse()) {
  const thumbUrl = thumbMap.get(e.itemId);
  if (!thumbUrl) continue;
  const insertAfter = e.fullMatch + `\n    thumbnailUrl: "${thumbUrl}",`;
  content = content.slice(0, e.pos) + insertAfter + content.slice(e.pos + e.fullMatch.length);
  injected++;
}

writeFileSync(FILE, content, "utf8");
console.log(`injecte=${injected} fichiers_modifies dans ${FILE}`);
console.log("prochaine_etape: npm run build && npm run dev pour verifier /creer-saas/catalogue");
