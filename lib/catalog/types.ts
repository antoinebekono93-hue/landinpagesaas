/** Types métier du catalogue MERCO automatisé. */

/** Champ JSONB tel que renvoyé par Hasura (string[] ou null). */
export type StringList = string[] | null;

/** Ligne de la table `catalog_products` (colonnes Nhost/Hasura). */
export type CatalogProductRow = {
  id: string;
  envato_item_id: string | null;
  slug: string;
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
  last_synced_at: string | null;
  tech_stack: StringList;
  tags: StringList;
  target_customers: StringList;
  features: StringList;
  dependencies: StringList;
  external_costs: StringList;
  multi_tenant_status: string;
  white_label_status: string;
  saas_candidate: boolean;
  saas_score: number;
  source_verified: boolean;
  license_verified: boolean;
  technically_verified: boolean;
  commercially_available: boolean;
  status: string;
  merco_notes: string | null;
  merco_screenshots: StringList;
  source_missing_since: string | null;
  created_at?: string;
  updated_at?: string;
};

/** Ligne de la table `catalog_demo_credentials`. */
export type DemoCredentialRow = {
  id: string;
  product_id: string;
  role: string;
  username: string;
  password: string;
  login_url: string | null;
  source_url: string | null;
  publicly_published: boolean;
  verified_at: string | null;
  created_at?: string;
  updated_at?: string;
};

/** Ligne de la table `catalog_sync_runs`. */
export type SyncRunRow = {
  id: string;
  started_at: string;
  finished_at: string | null;
  status: string;
  queries_count: number;
  items_received: number;
  items_created: number;
  items_updated: number;
  items_unchanged: number;
  items_failed: number;
  rate_limits: number;
  error_message: string | null;
  metadata?: Record<string, unknown> | null;
};

/** Ligne de la table `catalog_product_snapshots`. */
export type ProductSnapshotRow = {
  id: string;
  product_id: string;
  price: number | null;
  sales: number | null;
  rating: number | null;
  rating_count: number | null;
  envato_updated_at: string | null;
  captured_at: string;
};

/** Ligne de la table `catalog_admin_audit_logs`. */
export type AdminAuditRow = {
  id: string;
  admin_user_id: string;
  product_id: string | null;
  action: string;
  before_data?: Record<string, unknown> | null;
  after_data?: Record<string, unknown> | null;
  created_at?: string;
};

/** Types de ressource numérique d'un produit. */
export type CatalogResourceType =
  | "hosted_download"
  | "external_download"
  | "preview"
  | "documentation";

/** Niveau d'accès d'une ressource. */
export type CatalogResourceAccessLevel = "public" | "free" | "premium";

/** Ligne de la table `catalog_resources` (colonnes Nhost/Hasura). */
export type CatalogResourceRow = {
  id: string;
  product_id: string;
  title: string;
  description: string | null;
  type: CatalogResourceType;
  access_level: CatalogResourceAccessLevel;
  file_path: string | null;
  external_url: string | null;
  version: string | null;
  changelog: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

/** Ligne de la table `catalog_resource_access_logs` (journal réel d'accès). */
export type ResourceAccessLogRow = {
  id: string;
  resource_id: string;
  user_id: string | null;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
};

/* ─────────────────────────── Vues publiques ─────────────────────────── */

/** Identifiant public de démo (ajouté manuellement depuis l'admin). */
export type DemoCredentialView = {
  id: string | null;
  role: string;
  username: string;
  password: string;
  loginUrl: string | null;
  sourceUrl: string | null;
  publiclyPublished: boolean;
  verifiedAt: string | null;
};

/** Vue publique d'un produit de catalogue (champs sûrs uniquement). */
export type CatalogProductView = {
  id: string;
  envatoItemId: string | null;
  slug: string;
  name: string;
  author: string | null;
  description: string;
  categoryKey: string;
  categoryLabel: string;
  productUrl: string;
  previewUrl: string | null;
  thumbnailUrl: string | null;
  regularPriceUsd: number | null;
  extendedPriceUsd: number | null;
  salesCount: number | null;
  rating: number | null;
  ratingCount: number | null;
  publishedAt: string | null;
  updatedAtEnvato: string | null;
  lastSyncedAt: string | null;
  techStack: string[];
  tags: string[];
  targetCustomers: string[];
  features: string[];
  dependencies: string[];
  externalCosts: string[];
  multiTenantStatus: "true" | "false" | "needs-audit" | "unknown";
  whiteLabelStatus: string;
  saasCandidate: boolean;
  saasScore: number;
  sourceVerified: boolean;
  licenseVerified: boolean;
  technicallyVerified: boolean;
  commerciallyAvailable: boolean;
  status: string;
  mercoNotes: string | null;
  mercoScreenshots: string[];
  sourceMissingSince: string | null;
  demoCredentials: DemoCredentialView[];
  resources: CatalogResourceView[];
};

/**
 * Vue publique d'une ressource numérique (jamais de `file_path`).
 * `hasFile` indique qu'un fichier est stocké côté MERCO sans exposer son
 * chemin (il est servi uniquement via la route d'accès autorisée).
 */
export type CatalogResourceView = {
  id: string;
  productId: string;
  title: string;
  description: string | null;
  type: CatalogResourceType;
  accessLevel: CatalogResourceAccessLevel;
  hasFile: boolean;
  externalUrl: string | null;
  version: string | null;
  changelog: string | null;
};

/** Modèle léger pour les cartes du catalogue (jamais de credentials côté client). */
export type CatalogCardModel = {
  id: string;
  slug: string;
  name: string;
  author: string | null;
  categoryKey: string;
  categoryLabel: string;
  description: string;
  regularPriceUsd: number | null;
  salesCount: number | null;
  rating: number | null;
  status: string;
  saasScore: number;
  saasCandidate: boolean;
  multiTenantStatus: CatalogProductView["multiTenantStatus"];
  licenseVerified: boolean;
  technicallyVerified: boolean;
  commerciallyAvailable: boolean;
  previewUrl: string | null;
  thumbnailUrl: string | null;
  mercoScreenshot: string | null;
  envatoItemId: string | null;
};
export type CatalogSourceMode = "nhost" | "static-fallback";

export type CatalogLoadResult = {
  products: CatalogProductView[];
  mode: CatalogSourceMode;
  lastSyncedAt: string | null;
};