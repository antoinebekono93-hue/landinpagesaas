import "server-only";
import { nhostGraphQL } from "@/lib/nhost/server";
import type {
  CatalogResourceRow,
  CatalogResourceAccessLevel,
  CatalogResourceType,
} from "./types";
import { adminInsertAudit } from "./admin";

/**
 * Opérations admin (server-only) sur les ressources du marketplace.
 * Chaque appel doit avoir été précédé d'une vérification du rôle admin.
 */

const RESOURCE_ROW_FIELDS = `
  id
  product_id
  title
  description
  type
  access_level
  file_path
  external_url
  version
  changelog
  is_active
  sort_order
  created_at
  updated_at
`;

export const RESOURCE_TYPES: CatalogResourceType[] = [
  "hosted_download",
  "external_download",
  "preview",
  "documentation",
];

export const RESOURCE_ACCESS_LEVELS: CatalogResourceAccessLevel[] = [
  "public",
  "free",
  "premium",
];

export type ResourceInput = {
  title: string;
  description?: string | null;
  type: CatalogResourceType;
  access_level: CatalogResourceAccessLevel;
  file_path?: string | null;
  external_url?: string | null;
  version?: string | null;
  changelog?: string | null;
  is_active: boolean;
  sort_order: number;
};

export function isResourceType(value: string): value is CatalogResourceType {
  return (RESOURCE_TYPES as string[]).includes(value);
}

export function isResourceAccessLevel(
  value: string
): value is CatalogResourceAccessLevel {
  return (RESOURCE_ACCESS_LEVELS as string[]).includes(value);
}

export async function adminGetProductResources(
  productId: string
): Promise<CatalogResourceRow[]> {
  const data = await nhostGraphQL<{
    catalog_resources: CatalogResourceRow[];
  }>(
    `query AdminGetResources($productId: uuid!) {
      catalog_resources(
        where: { product_id: { _eq: $productId } }
        order_by: { sort_order: asc }
      ) {
        ${RESOURCE_ROW_FIELDS}
      }
    }`,
    { productId }
  );
  return data.catalog_resources ?? [];
}

function striptoSet(input: ResourceInput): Record<string, unknown> {
  return {
    title: input.title,
    description: input.description ?? null,
    type: input.type,
    access_level: input.access_level,
    file_path: input.file_path ?? null,
    external_url: input.external_url ?? null,
    version: input.version ?? null,
    changelog: input.changelog ?? null,
    is_active: input.is_active,
    sort_order: input.sort_order,
  };
}

export async function adminUpsertResource(
  adminUserId: string,
  productId: string,
  input: ResourceInput,
  existingId?: string
): Promise<CatalogResourceRow> {
  let result: CatalogResourceRow;
  if (existingId) {
    const data = await nhostGraphQL<{
      update_catalog_resources_by_pk: CatalogResourceRow;
    }>(
      `mutation AdminUpdateResource($id: uuid!, $set: catalog_resources_set_input!) {
        update_catalog_resources_by_pk(pk_columns: { id: $id }, _set: $set) {
          ${RESOURCE_ROW_FIELDS}
        }
      }`,
      { id: existingId, set: striptoSet(input) }
    );
    result = data.update_catalog_resources_by_pk;
  } else {
    const data = await nhostGraphQL<{
      insert_catalog_resources_one: CatalogResourceRow;
    }>(
      `mutation AdminInsertResource($object: catalog_resources_insert_input!) {
        insert_catalog_resources_one(object: $object) {
          ${RESOURCE_ROW_FIELDS}
        }
      }`,
      { object: { ...input, product_id: productId } }
    );
    result = data.insert_catalog_resources_one;
  }

  await adminInsertAudit(adminUserId, productId, "resource_change", {
    after: {
      title: result.title,
      type: result.type,
      access_level: result.access_level,
      is_active: result.is_active,
    },
  });
  return result;
}

export async function adminDeleteResource(
  adminUserId: string,
  resourceId: string
): Promise<void> {
  const data = await nhostGraphQL<{
    delete_catalog_resources_by_pk: CatalogResourceRow | null;
  }>(
    `mutation AdminDeleteResource($id: uuid!) {
      delete_catalog_resources_by_pk(id: $id) {
        id
        product_id
        title
      }
    }`,
    { id: resourceId }
  );
  const deleted = data.delete_catalog_resources_by_pk;
  if (deleted) {
    await adminInsertAudit(
      adminUserId,
      deleted.product_id,
      "resource_change",
      { before: { title: deleted.title } }
    );
  }
}