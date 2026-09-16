import { MERCO_CATEGORIES, mercoCategoryLabel } from "@/lib/envato/category-queries";
import { nhostGraphQL } from "@/lib/nhost/server";
import { isNhostConfigured } from "@/lib/nhost/config";
import {
  researchCatalog,
  type ResearchSaaS,
} from "@/lib/saas-research-catalog";
import { scoreProduct } from "./scoring";
import { isSelectionCandidate } from "./status";
import type {
  CatalogCardModel,
  CatalogLoadResult,
  CatalogProductRow,
  CatalogProductView,
  CatalogSourceMode,
  DemoCredentialRow,
  DemoCredentialView,
} from "./types";

/**
 * Couche d'accès aux données du catalogue.
 *
 * - Nhost configuré  → lecture GraphQL (source unique).
 * - Nhost absent     → fallback sur les 40 candidats statiques (mode démo),
 *                       jamais présentés comme « disponibles commercialement ».
 *
 * Note : cette couche est utilisée par les Server Components / Server Actions.
 * Ne jamais importer `./source` depuis un Client Component.
 */

const PRODUCT_ROW_FIELDS = `
  id
  envato_item_id
  slug
  title
  author
  description
  category_key
  envato_category
  product_url
  preview_url
  thumbnail_url
  regular_price_usd
  extended_price_usd
  sales_count
  rating
  rating_count
  published_at
  updated_at_envato
  last_synced_at
  tech_stack
  tags
  target_customers
  features
  dependencies
  external_costs
  multi_tenant_status
  white_label_status
  saas_candidate
  saas_score
  source_verified
  license_verified
  technically_verified
  commercially_available
  status
  merco_notes
  merco_screenshots
  source_missing_since
`;

const PUBLIC_EXCLUDED_STATUSES = ["rejected", "archived"];

/* ─────────────────────────── Fallback statique ─────────────────────────── */

const LEGACY_CATEGORY_TO_MERCO: Record<string, string> = {
  crm: "crm-sales",
  reservation: "booking",
  ecommerce: "ecommerce",
  education: "education",
  rh: "hr-management",
  sites: "website-builder",
  logistique: "logistics",
  whatsapp: "whatsapp-crm",
};

function staticItemToView(item: ResearchSaaS): CatalogProductView {
  const previewUrl = item.demoUrls.find((demo) => demo.url)?.url ?? null;
  const multiTenantStatus =
    item.multiTenant === true
      ? "true"
      : item.multiTenant === false
        ? "false"
        : "needs-audit";

  const demoCredentials: DemoCredentialView[] = (item.demoCredentials ?? []).map(
    (credential) => ({
      id: null,
      role: credential.role,
      username: credential.username,
      password: credential.password,
      loginUrl: credential.loginUrl ?? null,
      sourceUrl: item.productUrl,
      publiclyPublished: true,
      verifiedAt: null,
    })
  );

  return {
    id: item.id,
    envatoItemId: null,
    slug: item.slug,
    name: item.name,
    author: item.author ?? null,
    description: item.shortDescription,
    categoryKey: LEGACY_CATEGORY_TO_MERCO[item.categoryKey] ?? item.categoryKey,
    categoryLabel: mercoCategoryLabel(
      LEGACY_CATEGORY_TO_MERCO[item.categoryKey] ?? item.categoryKey
    ),
    productUrl: item.productUrl,
    previewUrl,
    thumbnailUrl: null,
    regularPriceUsd: item.regularPriceObservedUsd ?? null,
    extendedPriceUsd: item.extendedPriceObservedUsd ?? null,
    salesCount: item.salesObserved ?? null,
    rating: item.ratingObserved ?? null,
    ratingCount: null,
    publishedAt: null,
    updatedAtEnvato: null,
    lastSyncedAt: null,
    techStack: item.techStack ?? [],
    tags: [],
    targetCustomers: item.targetCustomers,
    features: [],
    dependencies: item.dependencies,
    externalCosts: item.externalCosts,
    multiTenantStatus: multiTenantStatus as CatalogProductView["multiTenantStatus"],
    whiteLabelStatus: "unknown",
    saasCandidate: item.saasEligible,
    saasScore: scoreProduct({
      title: item.name,
      description: `${item.shortDescription} ${item.targetCustomers.join(" ")}`,
      updatedAt: null,
      sales: item.salesObserved ?? null,
      rating: item.ratingObserved ?? null,
      ratingCount: null,
      previewUrl,
      multiTenantStatus,
    }),
    sourceVerified: item.sourceVerified,
    licenseVerified: false,
    technicallyVerified: false,
    commerciallyAvailable: false,
    status: item.status,
    mercoNotes: item.riskFlags?.join(" – ") ?? null,
    mercoScreenshots: item.mercoScreenshots ?? [],
    sourceMissingSince: null,
    demoCredentials,
  };
}

function staticFallback(): CatalogLoadResult {
  return {
    products: researchCatalog.map(staticItemToView),
    mode: "static-fallback",
    lastSyncedAt: null,
  };
}

/* ─────────────────────────── Mapping Nhost ─────────────────────────── */

function asStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function rowToView(
  row: CatalogProductRow,
  credentials: DemoCredentialView[]
): CatalogProductView {
  const multiTenantRaw =
    row.multi_tenant_status === "true" ||
    row.multi_tenant_status === "needs-audit" ||
    row.multi_tenant_status === "false"
      ? row.multi_tenant_status
      : "unknown";

  return {
    id: row.id,
    envatoItemId: row.envato_item_id,
    slug: row.slug,
    name: row.title,
    author: row.author,
    description: row.description,
    categoryKey: row.category_key,
    categoryLabel: mercoCategoryLabel(row.category_key),
    productUrl: row.product_url,
    previewUrl: row.preview_url,
    thumbnailUrl: row.thumbnail_url,
    regularPriceUsd: row.regular_price_usd,
    extendedPriceUsd: row.extended_price_usd,
    salesCount: row.sales_count,
    rating: row.rating,
    ratingCount: row.rating_count,
    publishedAt: row.published_at,
    updatedAtEnvato: row.updated_at_envato,
    lastSyncedAt: row.last_synced_at,
    techStack: asStringList(row.tech_stack),
    tags: asStringList(row.tags),
    targetCustomers: asStringList(row.target_customers),
    features: asStringList(row.features),
    dependencies: asStringList(row.dependencies),
    externalCosts: asStringList(row.external_costs),
    multiTenantStatus: multiTenantRaw as CatalogProductView["multiTenantStatus"],
    whiteLabelStatus: row.white_label_status || "unknown",
    saasCandidate: row.saas_candidate,
    saasScore: row.saas_score ?? 0,
    sourceVerified: row.source_verified,
    licenseVerified: row.license_verified,
    technicallyVerified: row.technically_verified,
    commerciallyAvailable: row.commercially_available,
    status: row.status,
    mercoNotes: row.merco_notes,
    mercoScreenshots: asStringList(row.merco_screenshots),
    sourceMissingSince: row.source_missing_since,
    demoCredentials: credentials,
  };
}

/* ─────────────────────────── Reads (Nhost) ─────────────────────────── */

type ProductsQueryResult = { catalog_products: CatalogProductRow[] };

function credentialsQuery(ids: string[]) {
  return `
    query GetPublicCredentials($ids: [uuid!]) {
      catalog_demo_credentials(
        where: { product_id: { _in: $ids }, publicly_published: { _eq: true } }
      ) {
        id
        product_id
        role
        username
        password
        login_url
        source_url
        publicly_published
        verified_at
      }
    }
  `;
}

async function fetchCredentials(ids: string[]): Promise<DemoCredentialRow[]> {
  if (ids.length === 0) return [];
  try {
    const data = await nhostGraphQL<{
      catalog_demo_credentials: DemoCredentialRow[];
    }>(credentialsQuery(ids), { ids });
    return data.catalog_demo_credentials ?? [];
  } catch {
    return [];
  }
}

function credentialsToViews(
  rows: DemoCredentialRow[]
): Record<string, DemoCredentialView[]> {
  const map: Record<string, DemoCredentialView[]> = {};
  for (const row of rows) {
    const view: DemoCredentialView = {
      id: row.id,
      role: row.role,
      username: row.username,
      password: row.password,
      loginUrl: row.login_url,
      sourceUrl: row.source_url,
      publiclyPublished: row.publicly_published,
      verifiedAt: row.verified_at,
    };
    (map[row.product_id] ??= []).push(view);
  }
  return map;
}

async function loadFromNhost(): Promise<CatalogLoadResult> {
  const productsQuery = `
    query GetCatalogProducts($statuses: [String!]) {
      catalog_products(
        where: { status: { _nin: ${JSON.stringify(PUBLIC_EXCLUDED_STATUSES)} } }
        order_by: [{ category_key: asc }, { saas_score: desc }]
      ) {
        ${PRODUCT_ROW_FIELDS}
      }
    }
  `;
  const [productsData, latestSync] = await Promise.all([
    nhostGraphQL<ProductsQueryResult>(productsQuery),
    nhostGraphQL<{
      catalog_sync_runs: Array<{
        started_at: string;
        finished_at: string | null;
        status: string;
      }>;
    }>(
      `query GetLatestSync {
        catalog_sync_runs(order_by: { started_at: desc }, limit: 1) {
          started_at
          finished_at
          status
        }
      }`
    ),
  ]);

  const rows = productsData.catalog_products ?? [];
  const ids = rows.map((row) => row.id);
  const credentialsByProduct = credentialsToViews(await fetchCredentials(ids));
  const views = rows.map((row) =>
    rowToView(row, credentialsByProduct[row.id] ?? [])
  );

  const run = latestSync.catalog_sync_runs?.[0];
  const lastSyncedAt = run?.finished_at ?? run?.started_at ?? null;

  return {
    products: views,
    mode: "nhost",
    lastSyncedAt,
  };
}

/* ─────────────────────────── API publique ─────────────────────────── */

export async function loadCatalog(
  mode: CatalogSourceMode = "nhost"
): Promise<CatalogLoadResult> {
  if (mode === "static-fallback" || !isNhostConfigured()) {
    return staticFallback();
  }
  try {
    return await loadFromNhost();
  } catch (error) {
    console.error(
      "[MERCO] Lecture Nhost impossible, bascule sur le catalogue statique :",
      error instanceof Error ? error.message : error
    );
    return staticFallback();
  }
}

export async function loadProductBySlug(slug: string): Promise<{
  product: CatalogProductView | null;
  mode: CatalogSourceMode;
} | null> {
  if (!isNhostConfigured()) {
    const item = researchCatalog.find((entry) => entry.slug === slug);
    if (!item) return null;
    return { product: staticItemToView(item), mode: "static-fallback" };
  }
  try {
    const data = await nhostGraphQL<ProductsQueryResult>(
      `query GetProductBySlug($slug: String!) {
        catalog_products(
          where: {
            slug: { _eq: $slug },
            status: { _nin: ${JSON.stringify(PUBLIC_EXCLUDED_STATUSES)} }
          }
          limit: 1
        ) {
          ${PRODUCT_ROW_FIELDS}
        }
      }`,
      { slug }
    );
    const row = data.catalog_products?.[0];
    if (!row) return null;
    const creds = await fetchCredentials([row.id]);
    return {
      product: rowToView(row, credentialsToViews(creds)[row.id] ?? []),
      mode: "nhost",
    };
  } catch (error) {
    console.error(
      "[MERCO] Lecture produit Nhost impossible :",
      error instanceof Error ? error.message : error
    );
    return { product: null, mode: "nhost" };
  }
}

/** Top « Sélection MERCO » : les N meilleurs candidats scorés d'une catégorie. */
export async function getTopCandidates(
  categoryKey: string,
  limit = 5
): Promise<CatalogProductView[]> {
  const { products } = await loadCatalog();
  return products
    .filter(
      (product) =>
        product.categoryKey === categoryKey && isSelectionCandidate(product.status)
    )
    .sort((a, b) => b.saasScore - a.saasScore)
    .slice(0, limit);
}

export function getCatalogCategories() {
  return MERCO_CATEGORIES.map((c) => ({ key: c.key, label: c.label }));
}

/** Slugs connus pour generateStaticParams (build hors-ligne). */
export function getFallbackSlugs(): string[] {
  return researchCatalog.map((item) => item.slug);
}

/** Réduit une vue produit au modèle léger utilisé par les cartes client. */
export function toCardModel(product: CatalogProductView): CatalogCardModel {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    author: product.author,
    categoryKey: product.categoryKey,
    categoryLabel: product.categoryLabel,
    description: product.description,
    regularPriceUsd: product.regularPriceUsd,
    salesCount: product.salesCount,
    rating: product.rating,
    status: product.status,
    saasScore: product.saasScore,
    saasCandidate: product.saasCandidate,
    multiTenantStatus: product.multiTenantStatus,
    licenseVerified: product.licenseVerified,
    technicallyVerified: product.technicallyVerified,
    commerciallyAvailable: product.commerciallyAvailable,
    previewUrl: product.previewUrl,
    thumbnailUrl: product.thumbnailUrl,
    envatoItemId: product.envatoItemId,
  };
}