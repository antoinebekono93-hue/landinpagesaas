import "server-only";
import { nhostGraphQL } from "@/lib/nhost/server";
import type {
  CatalogProductRow,
  DemoCredentialRow,
} from "./types";

/**
 * Opérations admin (server-only) : lecture large, mise à jour guidée,
 * credentials manuels, audit log, stats dashboard.
 * Chaque appel doit avoir été précédé d'une vérification du rôle admin.
 */

const ADMIN_PRODUCT_ROW_FIELDS = `
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
  created_at
  updated_at
`;

export type AdminProductFilters = {
  category?: string;
  status?: string;
  search?: string;
  license?: boolean;
  technical?: boolean;
  commercial?: boolean;
  preview?: boolean;
  author?: string;
  limit?: number;
  offset?: number;
};

export async function adminListProducts(
  filters: AdminProductFilters = {}
): Promise<CatalogProductRow[]> {
  const where: Record<string, unknown>[] = [];
  if (filters.category) where.push({ category_key: { _eq: filters.category } });
  if (filters.status) where.push({ status: { _eq: filters.status } });
  if (filters.license !== undefined)
    where.push({ license_verified: { _eq: filters.license } });
  if (filters.technical !== undefined)
    where.push({ technically_verified: { _eq: filters.technical } });
  if (filters.commercial !== undefined)
    where.push({ commercially_available: { _eq: filters.commercial } });
  if (filters.preview !== undefined)
    where.push({ preview_url: { _is_null: !filters.preview } });
  if (filters.author) where.push({ author: { _ilike: `%${filters.author}%` } });
  if (filters.search) {
    const term = filters.search;
    where.push({
      _or: [
        { title: { _ilike: `%${term}%` } },
        { description: { _ilike: `%${term}%` } },
        { slug: { _ilike: `%${term}%` } },
      ],
    });
  }

  const data = await nhostGraphQL<{ catalog_products: CatalogProductRow[] }>(
    `query AdminListProducts(
      $where: catalog_products_bool_exp!
      $limit: Int
      $offset: Int
    ) {
      catalog_products(
        where: $where
        order_by: [{ category_key: asc }, { saas_score: desc }]
        limit: $limit
        offset: $offset
      ) {
        ${ADMIN_PRODUCT_ROW_FIELDS}
      }
    }`,
    {
      where: where.length > 0 ? { _and: where } : {},
      limit: filters.limit ?? 100,
      offset: filters.offset ?? 0,
    }
  );
  return data.catalog_products ?? [];
}

export async function adminGetProductById(id: string): Promise<CatalogProductRow | null> {
  const data = await nhostGraphQL<{ catalog_products: CatalogProductRow[] }>(
    `query AdminGetProduct($id: uuid!) {
      catalog_products(where: { id: { _eq: $id } }, limit: 1) {
        ${ADMIN_PRODUCT_ROW_FIELDS}
      }
    }`,
    { id }
  );
  return data.catalog_products?.[0] ?? null;
}

export async function adminGetProductBySlug(
  slug: string
): Promise<CatalogProductRow | null> {
  const data = await nhostGraphQL<{ catalog_products: CatalogProductRow[] }>(
    `query AdminGetProductBySlug($slug: String!) {
      catalog_products(where: { slug: { _eq: $slug } }, limit: 1) {
        ${ADMIN_PRODUCT_ROW_FIELDS}
      }
    }`,
    { slug }
  );
  return data.catalog_products?.[0] ?? null;
}

export async function adminGetProductCredentials(
  productId: string
): Promise<DemoCredentialRow[]> {
  const data = await nhostGraphQL<{
    catalog_demo_credentials: DemoCredentialRow[];
  }>(
    `query AdminGetCredentials($productId: uuid!) {
      catalog_demo_credentials(
        where: { product_id: { _eq: $productId } }
        order_by: { role: asc }
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
        created_at
        updated_at
      }
    }`,
    { productId }
  );
  return data.catalog_demo_credentials ?? [];
}

/** Champs sensibles tracés dans l'audit log. */
const SENSITIVE_KEYS = [
  "license_verified",
  "technically_verified",
  "commercially_available",
  "status",
] as const;

export async function adminUpdateProduct(
  id: string,
  adminUserId: string,
  patch: Record<string, unknown>
): Promise<CatalogProductRow> {
  const before = await adminGetProductById(id);
  if (!before) throw new Error("Produit introuvable.");

  // Garde-fous d'activation (#29)
  const nextLicense = patch.license_verified ?? before.license_verified;
  if (nextLicense === true) {
    const conflicting = patch.commercially_available ?? before.commercially_available;
    if (
      conflicting === true &&
      patch.technically_verified !== true &&
      before.technically_verified !== true
    ) {
      throw new Error(
        "Impossible d'activer commercialement : l'audit technique doit d'abord être validé."
      );
    }
  }
  const nextCommercial = patch.commercially_available ?? before.commercially_available;
  if (nextCommercial === true) {
    const license = patch.license_verified ?? before.license_verified;
    const technical = patch.technically_verified ?? before.technically_verified;
    if (license !== true || technical !== true) {
      throw new Error(
        "Activation commerciale refusée : licence ET audit technique doivent être validés (true)."
      );
    }
  }

  const data = await nhostGraphQL<{ update_catalog_products_by_pk: CatalogProductRow }>(
    `mutation AdminUpdateProduct($id: uuid!, $set: catalog_products_set_input!) {
      update_catalog_products_by_pk(pk_columns: { id: $id }, _set: $set) {
        ${ADMIN_PRODUCT_ROW_FIELDS}
      }
    }`,
    { id, set: patch }
  );
  const after = data.update_catalog_products_by_pk;

  const sensitiveChanges: Array<{ key: string; before: unknown; after: unknown }> =
    [];
  for (const key of SENSITIVE_KEYS) {
    if (key in patch) {
      const beforeValue = before[key];
      const afterValue = patch[key];
      sensitiveChanges.push({ key, before: beforeValue, after: afterValue });
    }
  }
  if (sensitiveChanges.length > 0) {
    const beforeData: Record<string, unknown> = {};
    const afterData: Record<string, unknown> = {};
    for (const change of sensitiveChanges) {
      beforeData[change.key] = change.before;
      afterData[change.key] = change.after;
    }
    await adminInsertAudit(adminUserId, after.id, "product_status_change", {
      before: beforeData,
      after: afterData,
    });
  }

  return after;
}

export async function adminInsertAudit(
  adminUserId: string,
  productId: string | null,
  action: string,
  payload: { before?: Record<string, unknown>; after?: Record<string, unknown> }
): Promise<void> {
  await nhostGraphQL(
    `mutation AdminInsertAudit($object: catalog_admin_audit_logs_insert_input!) {
      insert_catalog_admin_audit_logs_one(object: $object) { id }
    }`,
    {
      object: {
        admin_user_id: adminUserId,
        product_id: productId,
        action,
        before_data: payload.before ?? null,
        after_data: payload.after ?? null,
      },
    }
  );
}

export type CredentialInput = {
  role: string;
  username: string;
  password: string;
  login_url?: string | null;
  source_url?: string | null;
  publicly_published: boolean;
};

export async function adminUpsertCredential(
  adminUserId: string,
  productId: string,
  input: CredentialInput,
  existingId?: string
): Promise<DemoCredentialRow> {
  let result: DemoCredentialRow;
  if (existingId) {
    const data = await nhostGraphQL<{
      update_catalog_demo_credentials_by_pk: DemoCredentialRow;
    }>(
      `mutation AdminUpdateCredential($id: uuid!, $set: catalog_demo_credentials_set_input!) {
        update_catalog_demo_credentials_by_pk(pk_columns: { id: $id }, _set: $set) {
          id
          product_id
          role
          username
          password
          login_url
          source_url
          publicly_published
          verified_at
          updated_at
        }
      }`,
      { id: existingId, set: striptoSet(input) }
    );
    result = data.update_catalog_demo_credentials_by_pk;
  } else {
    const data = await nhostGraphQL<{
      insert_catalog_demo_credentials_one: DemoCredentialRow;
    }>(
      `mutation AdminInsertCredential($object: catalog_demo_credentials_insert_input!) {
        insert_catalog_demo_credentials_one(object: $object) {
          id
          product_id
          role
          username
          password
          login_url
          source_url
          publicly_published
          verified_at
          created_at
          updated_at
        }
      }`,
      { object: { ...input, product_id: productId } }
    );
    result = data.insert_catalog_demo_credentials_one;
  }

  await adminInsertAudit(adminUserId, productId, "demo_credential_change", {
    after: { role: result.role, publicly_published: result.publicly_published },
  });
  return result;
}

function striptoSet(input: CredentialInput): Record<string, unknown> {
  return {
    role: input.role,
    username: input.username,
    password: input.password,
    login_url: input.login_url ?? null,
    source_url: input.source_url ?? null,
    publicly_published: input.publicly_published,
  };
}

export async function adminDeleteCredential(
  adminUserId: string,
  credentialId: string
): Promise<void> {
  const data = await nhostGraphQL<{
    delete_catalog_demo_credentials_by_pk: DemoCredentialRow | null;
  }>(
    `mutation AdminDeleteCredential($id: uuid!) {
      delete_catalog_demo_credentials_by_pk(id: $id) {
        id
        product_id
        role
      }
    }`,
    { id: credentialId }
  );
  const deleted = data.delete_catalog_demo_credentials_by_pk;
  if (deleted) {
    await adminInsertAudit(adminUserId, deleted.product_id, "demo_credential_change", {
      before: { role: deleted.role },
    });
  }
}

export type DashboardStats = {
  total: number;
  newThisWeek: number;
  research: number;
  review: number;
  technicalReview: number;
  licenseReview: number;
  active: number;
  rejected: number;
  lastSync: {
    startedAt: string | null;
    finishedAt: string | null;
    status: string | null;
    errorMessage: string | null;
  } | null;
};

type CountResult = { aggregate: { count: number } };

async function countWhere(where: Record<string, unknown>): Promise<number> {
  const data = await nhostGraphQL<{ catalog_products_aggregate: CountResult }>(
    `query AdminCount($where: catalog_products_bool_exp!) {
      catalog_products_aggregate(where: $where) {
        aggregate { count }
      }
    }`,
    { where }
  );
  return data.catalog_products_aggregate.aggregate.count;
}

export async function adminDashboardStats(): Promise<DashboardStats> {
  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const [total, newThisWeek, research, review, technicalReview, licenseReview, active, rejected, lastSyncData] =
    await Promise.all([
      countWhere({}),
      countWhere({ created_at: { _gte: weekAgo } }),
      countWhere({ status: { _eq: "research" } }),
      countWhere({ status: { _eq: "review" } }),
      countWhere({ status: { _eq: "technical_review" } }),
      countWhere({ status: { _eq: "license_review" } }),
      countWhere({ status: { _eq: "active" } }),
      countWhere({ status: { _eq: "rejected" } }),
      nhostGraphQL<{
        catalog_sync_runs: Array<{
          started_at: string;
          finished_at: string | null;
          status: string | null;
          error_message: string | null;
        }>;
      }>(
        `query AdminLastSync {
          catalog_sync_runs(order_by: { started_at: desc }, limit: 1) {
            started_at
            finished_at
            status
            error_message
          }
        }`
      ),
    ]);

  const run = lastSyncData.catalog_sync_runs?.[0] ?? null;
  return {
    total,
    newThisWeek,
    research,
    review,
    technicalReview,
    licenseReview,
    active,
    rejected,
    lastSync: run
      ? {
          startedAt: run.started_at,
          finishedAt: run.finished_at,
          status: run.status,
          errorMessage: run.error_message,
        }
      : null,
  };
}