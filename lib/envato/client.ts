import "server-only";

/**
 * Client Envato Market API — SERVER ONLY.
 *
 * - N'utilise QUE les endpoints officiels de l'API : jamais de scraping HTML,
 *   jamais de Playwright/Puppeteer sur codecanyon.net / market.envato.com.
 * - Le token `ENVATO_API_TOKEN` est lu côté serveur uniquement.
 * - Gère timeout, erreurs réseau, JSON invalide, 401/403/404/429/5xx.
 * - Sur 429 : lit `Retry-After` puis retente (max 3 tentatives par requête).
 */

const ENVATO_API_BASE = "https://api.envato.com/v3/market";
const MAX_ATTEMPTS = 3;
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_RATE_LIMIT_BACKOFF_MS = 60_000;

export type EnvatoErrorCode =
  | "network"
  | "timeout"
  | "invalid-json"
  | "unauthorized"
  | "forbidden"
  | "not-found"
  | "rate-limited"
  | "server"
  | "unknown";

export class EnvatoApiError extends Error {
  code: EnvatoErrorCode;
  status?: number;
  retryAfterMs?: number;

  constructor(
    message: string,
    code: EnvatoErrorCode,
    status?: number,
    retryAfterMs?: number
  ) {
    super(message);
    this.name = "EnvatoApiError";
    this.code = code;
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

export function isEnvatoConfigured(): boolean {
  return Boolean(process.env.ENVATO_API_TOKEN);
}

function getToken(): string {
  const token = process.env.ENVATO_API_TOKEN;
  if (!token) {
    throw new EnvatoApiError(
      "ENVATO_API_TOKEN manquant (serveur uniquement).",
      "unknown"
    );
  }
  return token;
}

function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) return undefined;
  return Math.min(seconds * 1000, 5 * 60_000);
}

async function attempt<T>(
  path: string,
  options: { timeoutMs?: number }
): Promise<T> {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${ENVATO_API_BASE}${path}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        Accept: "application/vnd.api+json",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    if (response.status === 429) {
      const retryAfterMs = parseRetryAfter(response.headers.get("retry-after"));
      throw new EnvatoApiError(
        "Envato rate limit atteint (429).",
        "rate-limited",
        response.status,
        retryAfterMs ?? DEFAULT_RATE_LIMIT_BACKOFF_MS
      );
    }
    if (response.status === 401) {
      throw new EnvatoApiError(
        "Envato a refusé le token (401). Vérifiez ENVATO_API_TOKEN.",
        "unauthorized",
        response.status
      );
    }
    if (response.status === 403) {
      throw new EnvatoApiError(
        "Envato a refusé l'accès à cette ressource (403).",
        "forbidden",
        response.status
      );
    }
    if (response.status === 404) {
      throw new EnvatoApiError(
        "Ressource Envato introuvable (404).",
        "not-found",
        response.status
      );
    }
    if (response.status >= 500) {
      throw new EnvatoApiError(
        `Envato a répondu ${response.status}.`,
        "server",
        response.status
      );
    }
    if (!response.ok) {
      throw new EnvatoApiError(
        `Envato a répondu ${response.status}.`,
        "unknown",
        response.status
      );
    }

    const text = await response.text();
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new EnvatoApiError(
        "Réponse Envato non parsable (JSON invalide).",
        "invalid-json",
        response.status
      );
    }
  } catch (error) {
    if (error instanceof EnvatoApiError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new EnvatoApiError("Timeout Envato.", "timeout");
    }
    throw new EnvatoApiError(
      error instanceof Error ? error.message : "Erreur réseau Envato.",
      "network"
    );
  } finally {
    clearTimeout(timer);
  }
}

/** Requête Envato avec retries bornés (max 3 tentatives, recul sur 429). */
export async function envatoRequest<T>(
  path: string,
  options: { timeoutMs?: number } = {}
): Promise<T> {
  let lastError: EnvatoApiError | null = null;
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    try {
      return await attempt<T>(path, options);
    } catch (error) {
      if (error instanceof EnvatoApiError) {
        lastError = error;
        if (
          error.code !== "rate-limited" &&
          error.code !== "timeout" &&
          error.code !== "server" &&
          error.code !== "network"
        ) {
          // Erreurs définitives (401/403/404/invalid-json) : pas de retry.
          throw error;
        }
        const backoff = error.retryAfterMs ?? DEFAULT_RATE_LIMIT_BACKOFF_MS * (i + 1);
        await sleep(backoff);
        continue;
      }
      throw error;
    }
  }
  throw (
    lastError ??
    new EnvatoApiError("Envato : échec après plusieurs tentatives.", "unknown")
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ─────────────────────────── Types Envato ─────────────────────────── */

export type EnvatoPrice = {
  id?: string;
  amount?: string;
  currency?: string;
};

export type EnvatoThumbnailUrl = {
  [size: string]: string;
};

export type EnvatoSearchItem = {
  id: number;
  name?: string;
  url?: string;
  site?: string;
  author_username?: string;
  author_url?: string;
  price_cents?: number;
  prices?: EnvatoPrice[];
  number_of_sales?: number;
  rating?: number;
  rating_count?: number;
  published_at?: string;
  updated_at?: string;
  tags?: string[];
  preview_url?: string | null;
  live_preview_url?: string | null;
  thumbnail_urls?: EnvatoThumbnailUrl;
};

export type EnvatoSearchResponse = {
  total_count?: number;
  matches?: EnvatoSearchItem[];
};

export type EnvatoAttribute = {
  name?: string;
  value?: string | null;
};

export type EnvatoCatalogItem = EnvatoSearchItem & {
  description?: string;
  description_html?: string;
  classification?: string;
  versions?: string[];
  attributes?: EnvatoAttribute[];
};

/* ─────────────────────────── Endpoints ─────────────────────────── */

/** Recherche officielle : `GET /v3/market/catalog/search?term=...` */
export async function searchCatalogItems(
  term: string,
  options: { limit?: number; timeoutMs?: number } = {}
): Promise<EnvatoSearchItem[]> {
  const params = new URLSearchParams({ term });
  if (options.limit) params.set("search_limit", String(options.limit));
  const data = await envatoRequest<EnvatoSearchResponse>(
    `/catalog/search?${params.toString()}`,
    options
  );
  return Array.isArray(data.matches) ? data.matches : [];
}

/** Détails d'un item : `GET /v3/market/catalog/item?id=...` */
export async function getCatalogItem(
  id: string | number,
  options: { timeoutMs?: number } = {}
): Promise<EnvatoCatalogItem | null> {
  return envatoRequest<EnvatoCatalogItem>(
    `/catalog/item?id=${encodeURIComponent(String(id))}`,
    options
  );
}

/** True si l'item provient de CodeCanyon (seul marché retenu par MERCO). */
export function isCodeCanyonItem(item: {
  url?: string;
  site?: string;
}): boolean {
  if (item.site) return item.site.toLowerCase().includes("codecanyon");
  return item.url?.toLowerCase().includes("codecanyon.net") ?? false;
}

/** Prix officiel approximatif en USD depuis les champs publichets des items. */
export function readPriceUsd(item: {
  price_cents?: number;
  prices?: EnvatoPrice[];
}): number | null {
  if (Array.isArray(item.prices) && item.prices.length > 0) {
    const usd = item.prices.find(
      (p) => (p.currency ?? "USD").toUpperCase() === "USD"
    );
    const amount = Number(usd?.amount ?? item.prices[0]?.amount);
    if (Number.isFinite(amount) && amount > 0) return amount;
  }
  if (typeof item.price_cents === "number" && item.price_cents > 0) {
    return Math.round(item.price_cents) / 100;
  }
  return null;
}

/** Date ISO de dernière mise à jour côté Envato (ou null). */
export function readUpdatedAt(item: { updated_at?: string }): string | null {
  if (!item.updated_at) return null;
  const date = new Date(item.updated_at);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}