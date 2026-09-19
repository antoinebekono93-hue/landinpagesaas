import "server-only";
import {
  CATEGORY_QUERIES,
  type CategoryQueryConfig,
} from "@/lib/envato/category-queries";
import {
  EnvatoApiError,
  getBestEnvatoImage,
  getCatalogItem,
  isCodeCanyonItem,
  readPriceUsd,
  searchCatalogItems,
  type EnvatoCatalogItem,
  type EnvatoPrice,
} from "@/lib/envato/client";
import { nhostGraphQL } from "@/lib/nhost/server";
import { scoreProduct } from "./scoring";

/**
 * Synchronisation Envato → Nhost.
 *
 * Règles non négociables :
 * - On n'utilise QUE l'API officielle Envato (aucun scraping).
 * - La sync ne modifie JAMAIS license_verified / technically_verified /
 *   commercially_available / status / merco_notes (champs MERCO manuels).
 * - Les champs MERCO sont préservés via `update_columns` restreint.
 * - En cas de 5xx Envato : on garde les dernières données Nhost intactes.
 * - Verrou : une seule sync en parallèle (HTTP 409 si déjà active).
 */

export class SyncConflictError extends Error {
  constructor() {
    super("Une synchronisation est déjà en cours.");
    this.name = "SyncConflictError";
  }
}

export class SyncNotConfiguredError extends Error {
  constructor() {
    super(
      "Synchronisation impossible : Nhost ou ENVATO_API_TOKEN non configuré."
    );
    this.name = "SyncNotConfiguredError";
  }
}

export type SyncReport = {
  success: boolean;
  startedAt: string;
  finishedAt: string | null;
  created: number;
  updated: number;
  unchanged: number;
  failed: number;
  rateLimited: number;
  errorMessage: string | null;
};

const LOCK_KEY = "global";
const LOCK_DURATION_MS = 30 * 60 * 1000;

type LockRow = { active: boolean; expires_at: string | null };

async function acquireLock(): Promise<boolean> {
  const data = await nhostGraphQL<{ catalog_sync_lock: LockRow[] }>(
    `query GetLock($key: String!) {
      catalog_sync_lock(where: { lock_key: { _eq: $key } }) {
        active
        expires_at
      }
    }`,
    { key: LOCK_KEY }
  );
  const row = data.catalog_sync_lock?.[0];
  const now = Date.now();
  if (row?.active && row.expires_at) {
    const expires = new Date(row.expires_at).getTime();
    if (!Number.isNaN(expires) && expires > now) return false;
  }
  const nowIso = new Date(now).toISOString();
  const expiresIso = new Date(now + LOCK_DURATION_MS).toISOString();
  await nhostGraphQL(
    `mutation AcquireLock($objects: [catalog_sync_lock_insert_input!]!) {
      insert_catalog_sync_lock(
        objects: $objects
        on_conflict: {
          constraint: catalog_sync_lock_lock_key_key
          update_columns: [active, expires_at, updated_at]
        }
      ) {
        affected_rows
      }
    }`,
    {
      objects: [{ lock_key: LOCK_KEY, active: true, expires_at: expiresIso }],
    }
  );
  return true;
}

async function releaseLock(): Promise<void> {
  await nhostGraphQL(
    `mutation ReleaseLock($key: String!, $now: timestamptz!) {
      update_catalog_sync_lock(
        where: { lock_key: { _eq: $key } }
        _set: { active: false, updated_at: $now }
      ) {
        affected_rows
      }
    }`,
    { key: LOCK_KEY, now: new Date().toISOString() }
  );
}

/* ─────────────────────────── Normalisation ─────────────────────────── */

type NormalizedProduct = {
  envato_item_id: string;
  title: string;
  author: string | null;
  description: string;
  category_key: string;
  envato_category: string | null;
  product_url: string;
  preview_url: string | null;
  thumbnail_url: string | null;
  regular_price_usd: number | null;
  extended_price_usd: number | null;
  sales_count: number | null;
  rating: number | null;
  rating_count: number | null;
  published_at: string | null;
  updated_at_envato: string | null;
  tags: string[];
  tech_stack: string[];
  features: string[];
  multi_tenant_status: string;
  white_label_status: string;
  saas_candidate: boolean;
  saas_score: number;
};

const FAILSAFE_SLUG = "candidat";

function slugify(value: string, id: string): string {
  const normalized = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return normalized || `${FAILSAFE_SLUG}-${id}`;
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 3000);
}

const TECH_KEYWORDS: Array<{ keyword: string; stack: string }> = [
  { keyword: "laravel", stack: "Laravel" },
  { keyword: "react", stack: "React" },
  { keyword: "vue", stack: "Vue" },
  { keyword: "node", stack: "Node.js" },
  { keyword: "next.js", stack: "Next.js" },
  { keyword: "nextjs", stack: "Next.js" },
  { keyword: "php", stack: "PHP" },
  { keyword: "asp.net", stack: "ASP.NET" },
  { keyword: "django", stack: "Django" },
  { keyword: "python", stack: "Python" },
  { keyword: "flutter", stack: "Flutter" },
  { keyword: "wordpress", stack: "WordPress" },
  { keyword: "filament", stack: "Filament" },
  { keyword: "tailwind", stack: "Tailwind" },
  { keyword: "mysql", stack: "MySQL" },
  { keyword: "postgres", stack: "PostgreSQL" },
  { keyword: "mongodb", stack: "MongoDB" },
  { keyword: "firebase", stack: "Firebase" },
  { keyword: "stripe", stack: "Stripe" },
];

function readUsdAmount(price?: EnvatoPrice): number | null {
  const amount = Number(price?.amount);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function readPricePair(item: EnvatoCatalogItem): {
  regular: number | null;
  extended: number | null;
} {
  const fromSearch = readPriceUsd(item);
  if (!Array.isArray(item.prices) || item.prices.length === 0) {
    return { regular: fromSearch, extended: null };
  }
  const amounts = item.prices
    .map(readUsdAmount)
    .filter((value): value is number => value !== null);
  if (amounts.length === 0) return { regular: fromSearch, extended: null };
  const sorted = [...amounts].sort((a, b) => a - b);
  const regular = sorted[0];
  const extended = sorted.length > 1 ? sorted[sorted.length - 1] : null;
  return { regular, extended };
}

function detectTechStack(item: EnvatoCatalogItem): string[] {
  const haystack = [
    (item.name ?? "").toLowerCase(),
    (item.classification ?? "").toLowerCase(),
    (item.tags ?? []).join(" ").toLowerCase(),
    stripHtml(item.description_html ?? item.description ?? "").toLowerCase(),
    (item.attributes ?? [])
      .map((attribute) => `${attribute.name} ${attribute.value}`.toLowerCase())
      .join(" "),
  ].join(" ");
  const found: string[] = [];
  for (const { keyword, stack } of TECH_KEYWORDS) {
    if (haystack.includes(keyword)) found.push(stack);
  }
  return [...new Set(found)].slice(0, 8);
}

function detectMultiTenant(item: EnvatoCatalogItem): string {
  const haystack = [
    item.name ?? "",
    item.classification ?? "",
    (item.tags ?? []).join(" "),
    stripHtml(item.description_html ?? item.description ?? ""),
    (item.attributes ?? [])
      .map((attribute) => `${attribute.name} ${attribute.value}`)
      .join(" "),
  ]
    .join(" ")
    .toLowerCase();
  return /multi[-\s]?tenant|multitenanc|subscri(ption|bable|ber)/.test(haystack)
    ? "needs-audit"
    : "unknown";
}

function detectWhiteLabel(item: EnvatoCatalogItem): string {
  const haystack = [
    item.name ?? "",
    (item.tags ?? []).join(" "),
    stripHtml(item.description_html ?? item.description ?? ""),
  ]
    .join(" ")
    .toLowerCase();
  return /white[-\s]?label/.test(haystack) ? "needs-audit" : "unknown";
}

function isSaaSCandidate(item: EnvatoCatalogItem): boolean {
  const haystack = [
    item.name ?? "",
    (item.tags ?? []).join(" "),
    stripHtml(item.description_html ?? item.description ?? ""),
    detectMultiTenant(item),
  ]
    .join(" ")
    .toLowerCase();
  return (
    /\bsaas\b/.test(haystack) ||
    /multi[-\s]?tenant|multitenanc|subscri(ption|bable|ber)/.test(haystack)
  );
}

function normalize(
  item: EnvatoCatalogItem,
  categoryKey: string,
  id: string
): NormalizedProduct {
  const { regular, extended } = readPricePair(item);
  const description =
    stripHtml(item.description_html ?? item.description ?? item.name ?? "") ||
    (item.name ?? id);
  const tags = (item.tags ?? []).map(String).slice(0, 12);
  const multiTenantStatus = detectMultiTenant(item);
  const whiteLabelStatus = detectWhiteLabel(item);
  const saasCandidate = isSaaSCandidate(item);
  const publishedAt =
    item.published_at && !Number.isNaN(new Date(item.published_at).getTime())
      ? new Date(item.published_at).toISOString()
      : null;
  const updatedAtEnvato =
    item.updated_at && !Number.isNaN(new Date(item.updated_at).getTime())
      ? new Date(item.updated_at).toISOString()
      : null;

  const saasScore = scoreProduct({
    title: item.name ?? id,
    description,
    updatedAt: updatedAtEnvato,
    sales: item.number_of_sales ?? null,
    rating: item.rating ?? null,
    ratingCount: item.rating_count ?? null,
    previewUrl: item.preview_url ?? item.live_preview_url ?? null,
    multiTenantStatus,
  });

  return {
    envato_item_id: String(item.id),
    title: item.name ?? `CodeCanyon ${item.id}`,
    author: item.author_username ?? null,
    description,
    category_key: categoryKey,
    envato_category: item.classification ?? null,
    product_url: item.url ?? `https://codecanyon.net/item/${item.id}`,
    preview_url: item.live_preview_url ?? item.preview_url ?? null,
    thumbnail_url: getBestEnvatoImage(item),
    regular_price_usd: regular,
    extended_price_usd: extended,
    sales_count: item.number_of_sales ?? null,
    rating: item.rating ?? null,
    rating_count: item.rating_count ?? null,
    published_at: publishedAt,
    updated_at_envato: updatedAtEnvato,
    tags,
    tech_stack: detectTechStack(item),
    features: [],
    multi_tenant_status: multiTenantStatus,
    white_label_status: whiteLabelStatus,
    saas_candidate: saasCandidate,
    saas_score: saasScore,
  };
}

/* ─────────────────────────── Persistance ─────────────────────────── */

const MERCO_PRESERVED_COLUMNS: Array<keyof CatalogInsertColumns> = [
  "title",
  "author",
  "description",
  "category_key",
  "envato_category",
  "product_url",
  "preview_url",
  "thumbnail_url",
  "regular_price_usd",
  "extended_price_usd",
  "sales_count",
  "rating",
  "rating_count",
  "published_at",
  "updated_at_envato",
  "last_synced_at",
  "tech_stack",
  "tags",
  "features",
  "multi_tenant_status",
  "white_label_status",
  "saas_candidate",
  "saas_score",
  "source_missing_since",
];

// Les champs MERCO ci-dessous ne sont JAMAIS dans update_columns :
// license_verified, technically_verified, commercially_available, status,
// merco_notes, created_at, updated_at.

type CatalogInsertColumns = Record<string, unknown>;

function upsertObjects(
  objects: Array<Record<string, unknown>>,
  seenSlugs: Map<string, string>
): Array<Record<string, unknown>> {
  return objects.map((object) => {
    const title = String(object.title ?? "");
    const id = String(object.envato_item_id ?? "");
    let slug = slugify(title, id);
    if (seenSlugs.has(slug) && seenSlugs.get(slug) !== id) {
      slug = `${slug}-${id}`;
    }
    seenSlugs.set(slug, id);
    return { ...object, slug };
  });
}

type ExistingRow = {
  envato_item_id: string;
  title: string;
  author: string | null;
  description: string;
  product_url: string;
  preview_url: string | null;
  regular_price_usd: number | null;
  extended_price_usd: number | null;
  sales_count: number | null;
  rating: number | null;
  rating_count: number | null;
  updated_at_envato: string | null;
  saas_score: number;
};

async function fetchExisting(
  ids: string[]
): Promise<Map<string, ExistingRow>> {
  if (ids.length === 0) return new Map();
  const data = await nhostGraphQL<{ catalog_products: ExistingRow[] }>(
    `query GetExisting($ids: [String!]) {
      catalog_products(where: { envato_item_id: { _in: $ids } }) {
        envato_item_id
        title
        author
        description
        product_url
        preview_url
        regular_price_usd
        extended_price_usd
        sales_count
        rating
        rating_count
        updated_at_envato
        saas_score
      }
    }`,
    { ids }
  );
  const map = new Map<string, ExistingRow>();
  for (const row of data.catalog_products ?? []) {
    map.set(row.envato_item_id, row);
  }
  return map;
}

function isUnchanged(object: Record<string, unknown>, row: ExistingRow): boolean {
  return (
    object.title === row.title &&
    object.author === row.author &&
    object.description === row.description &&
    object.product_url === row.product_url &&
    object.preview_url === row.preview_url &&
    object.regular_price_usd === row.regular_price_usd &&
    object.extended_price_usd === row.extended_price_usd &&
    object.sales_count === row.sales_count &&
    object.rating === row.rating &&
    object.rating_count === row.rating_count &&
    object.updated_at_envato === row.updated_at_envato &&
    object.saas_score === row.saas_score
  );
}

async function upsertProducts(
  objects: Array<Record<string, unknown>>
): Promise<{ created: number; updated: number; unchanged: number; written: Array<Record<string, unknown>> }> {
  if (objects.length === 0) return { created: 0, updated: 0, unchanged: 0, written: [] };
  const ids = objects.map((object) => String(object.envato_item_id));
  const existing = await fetchExisting(ids);

  const created: Array<Record<string, unknown>> = [];
  const toUpdate: Array<Record<string, unknown>> = [];
  let unchanged = 0;

  for (const object of objects) {
    const current = existing.get(String(object.envato_item_id));
    if (!current) {
      created.push(object);
    } else if (isUnchanged(object, current)) {
      unchanged += 1;
    } else {
      toUpdate.push(object);
    }
  }

  const write = [...created, ...toUpdate];
  if (write.length > 0) {
    const seenSlugs = new Map<string, string>();
    const objectsWithSlug = upsertObjects(write, seenSlugs);
    await nhostGraphQL(
      `mutation UpsertProducts(
        $objects: [catalog_products_insert_input!]!
        $updateColumns: [catalog_products_update_column!]!
      ) {
        insert_catalog_products(
          objects: $objects
          on_conflict: {
            constraint: catalog_products_envato_item_id_key
            update_columns: $updateColumns
          }
        ) {
          affected_rows
        }
      }`,
      {
        objects: objectsWithSlug,
        updateColumns: MERCO_PRESERVED_COLUMNS,
      }
    );
  }

  return {
    created: created.length,
    updated: toUpdate.length,
    unchanged,
    written: write,
  };
}

/** Historise prix/ventes/notes pour les produits écrits lors de la sync. */
async function captureSnapshots(
  objects: Array<Record<string, unknown>>
): Promise<void> {
  if (objects.length === 0) return;
  const ids = objects.map((object) => String(object.envato_item_id));
  const data = await nhostGraphQL<{
    catalog_products: Array<{ id: string; envato_item_id: string }>;
  }>(
    `query MapSnapshotIds($ids: [String!]) {
      catalog_products(where: { envato_item_id: { _in: $ids } }) {
        id
        envato_item_id
      }
    }`,
    { ids }
  );
  const idByEnvato = new Map(
    (data.catalog_products ?? []).map((row) => [row.envato_item_id, row.id])
  );
  const snapshotObjects = objects.flatMap((object) => {
    const productId = idByEnvato.get(String(object.envato_item_id));
    if (!productId) return [];
    return [
      {
        product_id: productId,
        price: object.regular_price_usd ?? null,
        sales: object.sales_count ?? null,
        rating: object.rating ?? null,
        rating_count: object.rating_count ?? null,
        envato_updated_at: object.updated_at_envato ?? null,
        captured_at: new Date().toISOString(),
      },
    ];
  });
  if (snapshotObjects.length === 0) return;
  await nhostGraphQL(
    `mutation InsertSnapshots($objects: [catalog_product_snapshots_insert_input!]!) {
      insert_catalog_product_snapshots(objects: $objects) {
        affected_rows
      }
    }`,
    { objects: snapshotObjects }
  );
}

async function markMissingSince(seenIds: string[]): Promise<void> {
  const now = new Date().toISOString();
  await nhostGraphQL(
    `mutation MarkMissing($seen: [String!], $now: timestamptz!) {
      update_catalog_products(
        where: {
          envato_item_id: { _nin: $seen }
          source_missing_since: { _is_null: true }
          status: { _nin: ["rejected", "archived", "active"] }
        }
        _set: { source_missing_since: $now }
      ) {
        affected_rows
      }
    }`,
    { seen: seenIds, now }
  );
}

async function logSyncRun(
  report: SyncReport,
  metadata?: { queriesCount: number; itemsReceived: number } | null
): Promise<void> {
  await nhostGraphQL(
    `mutation InsertSyncRun($object: catalog_sync_runs_insert_input!) {
      insert_catalog_sync_runs_one(object: $object) { id }
    }`,
    {
      object: {
        started_at: report.startedAt,
        finished_at: report.finishedAt,
        status: report.success ? "success" : "error",
        queries_count: metadata?.queriesCount ?? 0,
        items_received: metadata?.itemsReceived ?? 0,
        items_created: report.created,
        items_updated: report.updated,
        items_unchanged: report.unchanged,
        items_failed: report.failed,
        rate_limits: report.rateLimited,
        error_message: report.errorMessage,
        metadata: metadata ?? null,
      },
    }
  );
}

/* ─────────────────────────── Orchestration ─────────────────────────── */

async function runCategory(
  config: CategoryQueryConfig,
  seenIds: Set<string>,
  counters: { queries: number; received: number; failed: number; rateLimited: number },
  objects: Array<Record<string, unknown>>
): Promise<void> {
  for (const term of config.queries) {
    counters.queries += 1;
    let items: Awaited<ReturnType<typeof searchCatalogItems>>;
    try {
      items = await searchCatalogItems({
        term,
        site: "codecanyon.net",
        pageSize: 100,
      });
    } catch (error) {
      if (error instanceof EnvatoApiError && error.code === "rate-limited") {
        counters.rateLimited += 1;
        throw error; // Remonte : on stoppe la sync (429 global Envato).
      }
      counters.failed += 1;
      continue;
    }

    const pages = items.filter(isCodeCanyonItem);
    for (const page of pages) {
      const id = String(page.id);
      const envatoId = id as string;
      if (seenIds.has(envatoId)) continue;
      seenIds.add(envatoId);
      counters.received += 1;

      let detail: EnvatoCatalogItem = page;
      try {
        const fetched = await getCatalogItem(page.id);
        if (fetched) detail = fetched;
      } catch (error) {
        if (error instanceof EnvatoApiError && error.code === "rate-limited") {
          counters.rateLimited += 1;
          throw error;
        }
        counters.failed += 1;
      }

      objects.push(normalize(detail, config.key, envatoId));
    }
  }
}

export async function syncEnvatoCatalog(onProgress?: (step: string) => void): Promise<SyncReport> {
  const startedAt = new Date();
  const base: SyncReport = {
    success: false,
    startedAt: startedAt.toISOString(),
    finishedAt: null,
    created: 0,
    updated: 0,
    unchanged: 0,
    failed: 0,
    rateLimited: 0,
    errorMessage: null,
  };

  onProgress?.("préparation");
  const acquired = await acquireLock();
  if (!acquired) throw new SyncConflictError();

  const counters = { queries: 0, received: 0, failed: 0, rateLimited: 0 };
  const seenIds = new Set<string>();
  const objects: Array<Record<string, unknown>> = [];

  try {
    for (const config of CATEGORY_QUERIES) {
      onProgress?.(`catégorie ${config.label}`);
      await runCategory(config, seenIds, counters, objects);
    }

    onProgress?.("écriture en base");
    const { created, updated, unchanged, written } = await upsertProducts(objects);
    await captureSnapshots(written);
    await markMissingSince([...seenIds]);

    const finishedAt = new Date().toISOString();
    const report: SyncReport = {
      success: true,
      startedAt: base.startedAt,
      finishedAt,
      created,
      updated,
      unchanged,
      failed: counters.failed,
      rateLimited: counters.rateLimited,
      errorMessage: null,
    };
    await logSyncRun(report, {
      queriesCount: counters.queries,
      itemsReceived: counters.received,
    });
    await releaseLock();
    return report;
  } catch (error) {
    const report: SyncReport = {
      success: false,
      startedAt: base.startedAt,
      finishedAt: new Date().toISOString(),
      created: 0,
      updated: 0,
      unchanged: 0,
      failed: counters.failed,
      rateLimited: counters.rateLimited,
      errorMessage:
        error instanceof Error ? error.message : "Erreur de synchronisation.",
    };
    try {
      await logSyncRun(report, {
        queriesCount: counters.queries,
        itemsReceived: counters.received,
      });
    } catch {
      // Ne masque pas l'erreur d'origine si le log échoue.
    }
    try {
      await releaseLock();
    } catch {
      // Le lock expire automatiquement (expires_at) en cas d'échec de release.
    }
    throw error;
  }
}