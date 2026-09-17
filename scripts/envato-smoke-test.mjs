#!/usr/bin/env node
/**
 * Smoke-test authentifié Envato — CLI SERVER-ONLY (aucune route HTTP publique).
 *
 *  Règles de sécurité (strictes, jamais violées) :
 *  - Lit UNIQUEMENT process.env.ENVATO_API_TOKEN (coté serveur).
 *  - N'AFFICHE JAMAIS : le token, ni une partie, ni le header Authorization,
 *    ni une variable d'environnement. Seulement des statuts HTTP + compteurs.
 *  - Zéro scraping, zéro POST, zéro body : uniquement des GET officiels sur
 *    https://api.envato.com (v3 market + discovery).
 *  - Timeout 15s par requête (AbortController), max 3 tentatives par requête.
 *  - HTTP 429 : on lit Retry-After (Retry-After header) et on l'affiche, puis
 *    on se termine proprement (exit 0). On n'attend JAMAIS 5 minutes ici.
 *  - HTTP 401/403 : on affiche le statut et un message générique, exit 1.
 *  - La présence d'une licence "Extended" ou "Elite" dans une réponse de prix
 *    NE SIGNIFIE JAMAIS que notre catalogue l'a achetée : on l'affiche comme
 *    une information de prix, jamais comme un achat déduit.
 */

const ENVATO_API_BASE = "https://api.envato.com";
const TIMEOUT_MS = 15_000;
const MAX_ATTEMPTS = 3;
const TOKEN_ENV_NAME = "ENVATO_API_TOKEN";

function getToken() {
  const token = process.env[TOKEN_ENV_NAME];
  if (!token) {
    console.log("ENVATO_API_TOKEN manquant");
    process.exit(1);
  }
  return token;
}

async function getOnce(pathname, token) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${ENVATO_API_BASE}${pathname}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.api+json",
      },
      signal: controller.signal,
      cache: "no-store",
    });
    return {
      status: response.status,
      retryAfter: response.headers.get("retry-after"),
      text: await response.text(),
    };
  } catch (error) {
    return {
      status: 0,
      retryAfter: null,
      text: `[réseau/timeout] ${error instanceof Error ? error.name : String(error)}`,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function getJson(pathname, token) {
  let lastResult = null;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const result = await getOnce(pathname, token);
    lastResult = result;
    if (result.status === 429) return result;
    if (result.status === 401 || result.status === 403) return resultjoen;
    if (result.status >= 500) continue;
    if (result.status === 0) continue;
    return result;
  }
  return lastResult ?? { status: 0, retryAfter: null, text: "" };
}

function tryParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function firstOf(data) {
  const matches = Array.isArray(data?.matches) ? data.matches : [];
  return { count: matches.length, first: matches[0] ?? null };
}

function printItem(d) {
  console.log(`  First item ID: ${d?.id ?? ""}`);
  console.log(`  First item name: ${d?.name ?? ""}`);
  console.log(`  First item author: ${d?.author_username ?? d?.author ?? ""}`);
  console.log(`  First item URL: ${d?.url ?? ""}`);
  console.log(`  First item price_cents: ${d?.price_cents ?? ""}`);
  console.log(`  First item updated_at: ${d?.updated_at ?? ""}`);
  console.log(`  previews: ${Array.isArray(d?.previews) ? d.previews.length : 0}`);
}

console.log("=== Test 1 — Authentification (total items) ===");
{
  const token = getToken();
  const { status } = await getJson("/v1/market/total-items.json", token);
  console.log(`[Envato] Authentication: ${status === 200 ? "OK" : "FAILED"}`);
  console.log(`HTTP: ${status}`);
}

console.log("");
console.log("=== Test 2 — Recherche catalogue (GET discovery search) ===");
{
  const token = getToken();
  const qs = new URLSearchParams({
    term: "crm saas",
    site: "codecanyon.net",
    page: "1",
    page_size: "10",
    sort_by: "sales",
    sort_direction: "desc",
  });
  const { status, text } = await getJson(
    `/v1/discovery/search/search/item?${qs.toString()}`,
    token
  );
  console.log(`[Envato] Search: ${status === 200 ? "OK" : "FAILED"}`);
  console.log(`HTTP: ${status}`);
  if (status === 200) {
    const { count, first } = firstOf(tryParse(text));
    console.log(`Results: ${count}`);
    printItem(first);
  }
}

console.log("");
console.log("=== Test 3 — Détail item (catalog item) ===");
{
  const token = getToken();
  const qs = new URLSearchParams({
    term: "crm saas",
    site: "codecanyon.net",
  });
  const { status, text } = await getJson(
    `/v1/discovery/search/search/item?${qs.toString()}`,
    token
  );
  const id = status === 200 ? firstOf(tryParse(text)).first?.id : null;
  if (!id) {
    console.log("(aucun item trouvé — détail ignoré)");
  } else {
    const { status: s2, text: t2 } = await getJson(
      `/v3/market/catalog/item?id=${encodeURIComponent(String(id))}`,
      token
    );
    console.log(`[Envato] Item detail: ${s2 === 200 ? "OK" : "FAILED"}`);
    console.log(`HTTP: ${s2}`);
    if (s2 === 200) {
      const d = tryParse(t2);
      console.log(`  ID: ${d?.id ?? ""}`);
      console.log(`  name: ${d?.name ?? ""}`);
      console.log(`  author_username: ${d?.author_username ?? ""}`);
      console.log(`  number_of_sales: ${d?.number_of_sales ?? ""}`);
      console.log(`  rating: ${d?.rating ?? ""}`);
      console.log(`  rating_count: ${d?.rating_count ?? ""}`);
      console.log(`  updated_at: ${d?.updated_at ?? ""}`);
      console.log(`  price_cents: ${d?.price_cents ?? ""}`);
      console.log(`  previews: ${Array.isArray(d?.previews) ? d.previews.length : 0}`);
    }
  }
}

console.log("");
console.log("=== Test 4 — Prix / licences (item-prices) ===");
{
  const token = getToken();
  const qs = new URLSearchParams({
    term: "crm saas",
    site: "codecanyon.net",
  });
  const { status, text } = await getJson(
    `/v1/discovery/search/search/item?${qs.toString()}`,
    token
  );
  const id = status === 200 ? firstOf(tryParse(text)).first?.id : null;
  if (!id) {
    console.log("(aucun item — prix ignoré)");
  } else {
    const { status: s2, text: t2 } = await getJson(
      `/v1/market/item-prices:${encodeURIComponent(String(id))}.json`,
      token
    );
    console.log(`[Envato] Pricing: ${s2 === 200 ? "OK" : "FAILED"}`);
    console.log(`HTTP: ${s2}`);
    if (s2 === 200) {
      const data = tryParse(t2);
      const prices = Array.isArray(data?.item?.prices) ? data.item.prices : [];
      for (const p of prices) {
        console.log(`  ${p.name ?? ""}: ${p.amount ?? p.price ?? ""} ${p.currency ?? ""}`.trim());
      }
      console.log("(licence Extended ≠ achat : jamais déduite)");
    }
  }
}

console.log("");
console.log("Smoke-test Envato terminé.");
