#!/usr/bin/env node
import { readFileSync } from "fs";

const env = {};
readFileSync(".env.local", "utf8").split("\n").forEach((l) => {
  const i = l.indexOf("=");
  if (i > 0) env[l.substring(0, i).trim()] = l.substring(i + 1).trim();
});

const sub = env.NEXT_PUBLIC_NHOST_SUBDOMAIN;
const region = env.NEXT_PUBLIC_NHOST_REGION;
const secret = env.NHOST_ADMIN_SECRET;
const url = `https://${sub}.hasura.${region}.nhost.run/v1/metadata`;

if (!sub || !region || !secret) {
  console.log("CONFIG_MISSING");
  process.exit(1);
}

async function applyPermission(args) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-hasura-admin-secret": secret },
    body: JSON.stringify(args),
  });
  const body = await res.json();
  return { ok: !body.error, msg: body.message || body.error || "ok" };
}

const PUBLIC_VIEW_COLUMNS = [
  "id", "envato_item_id", "slug", "title", "author", "description",
  "category_key", "product_url", "preview_url", "thumbnail_url",
  "regular_price_usd", "extended_price_usd", "sales_count", "rating",
  "rating_count", "published_at", "updated_at_envato", "last_synced_at",
  "tech_stack", "tags", "target_customers", "features", "dependencies",
  "external_costs", "multi_tenant_status", "white_label_status",
  "saas_candidate", "saas_score", "status", "merco_screenshots",
];

const DEMO_COLUMNS = [
  "id", "product_id", "role", "username", "password", "login_url", "source_url",
];

const PRODUCT_COLUMNS = [
  "id", "envato_item_id", "slug", "title", "author", "description",
  "category_key", "envato_category", "product_url", "preview_url", "thumbnail_url",
  "regular_price_usd", "extended_price_usd", "sales_count", "rating", "rating_count",
  "published_at", "updated_at_envato", "last_synced_at", "tech_stack", "tags",
  "target_customers", "features", "dependencies", "external_costs",
  "multi_tenant_status", "white_label_status", "saas_candidate", "saas_score",
  "source_verified", "license_verified", "technically_verified",
  "commercially_available", "status", "merco_notes", "merco_screenshots",
  "source_missing_since", "created_at", "updated_at",
];

const DEMO_TABLE_COLUMNS = [
  "id", "product_id", "role", "username", "password", "login_url",
  "source_url", "publicly_published", "verified_at", "created_at", "updated_at",
];

const SYNC_RUN_COLUMNS = [
  "id", "started_at", "finished_at", "status", "queries_count", "items_received",
  "items_created", "items_updated", "items_unchanged", "items_failed",
  "rate_limits", "error_message", "metadata",
];

const SYNC_LOCK_COLUMNS = [
  "id", "lock_key", "active", "expires_at", "created_at", "updated_at",
];

const SNAPSHOT_COLUMNS = [
  "id", "product_id", "price", "sales", "rating", "rating_count",
  "envato_updated_at", "captured_at",
];

const AUDIT_COLUMNS = [
  "id", "admin_user_id", "product_id", "action", "before_data", "after_data", "created_at",
];

const permissions = [
  // ─── public role: SELECT on views ───
  { type: "pg_create_select_permission", args: { source: "default", table: { schema: "public", name: "public_catalog_products" }, role: "public", permission: { columns: PUBLIC_VIEW_COLUMNS, filter: {}, allow_aggregations: true } } },
  { type: "pg_create_select_permission", args: { source: "default", table: { schema: "public", name: "public_catalog_demo_credentials" }, role: "public", permission: { columns: DEMO_COLUMNS, filter: {}, allow_aggregations: false } } },

  // ─── user role: same as public on views ───
  { type: "pg_create_select_permission", args: { source: "default", table: { schema: "public", name: "public_catalog_products" }, role: "user", permission: { columns: PUBLIC_VIEW_COLUMNS, filter: {}, allow_aggregations: true } } },
  { type: "pg_create_select_permission", args: { source: "default", table: { schema: "public", name: "public_catalog_demo_credentials" }, role: "user", permission: { columns: DEMO_COLUMNS, filter: {}, allow_aggregations: false } } },

  // ─── admin role: CRUD on tables ───
  { type: "pg_create_select_permission", args: { source: "default", table: { schema: "public", name: "catalog_products" }, role: "admin", permission: { columns: PRODUCT_COLUMNS, filter: {}, allow_aggregations: true } } },
  { type: "pg_create_insert_permission", args: { source: "default", table: { schema: "public", name: "catalog_products" }, role: "admin", permission: { check: {}, set: {} } } },
  { type: "pg_create_update_permission", args: { source: "default", table: { schema: "public", name: "catalog_products" }, role: "admin", permission: { columns: PRODUCT_COLUMNS.filter(c => !["id", "envato_item_id", "created_at"].includes(c)), filter: {}, set: {} } } },

  { type: "pg_create_select_permission", args: { source: "default", table: { schema: "public", name: "catalog_demo_credentials" }, role: "admin", permission: { columns: DEMO_TABLE_COLUMNS, filter: {}, allow_aggregations: true } } },
  { type: "pg_create_insert_permission", args: { source: "default", table: { schema: "public", name: "catalog_demo_credentials" }, role: "admin", permission: { check: {}, set: {} } } },
  { type: "pg_create_update_permission", args: { source: "default", table: { schema: "public", name: "catalog_demo_credentials" }, role: "admin", permission: { columns: DEMO_TABLE_COLUMNS.filter(c => c !== "id"), filter: {}, set: {} } } },
  { type: "pg_create_delete_permission", args: { source: "default", table: { schema: "public", name: "catalog_demo_credentials" }, role: "admin", permission: { filter: {} } } },

  { type: "pg_create_select_permission", args: { source: "default", table: { schema: "public", name: "catalog_sync_runs" }, role: "admin", permission: { columns: SYNC_RUN_COLUMNS, filter: {}, allow_aggregations: true } } },
  { type: "pg_create_insert_permission", args: { source: "default", table: { schema: "public", name: "catalog_sync_runs" }, role: "admin", permission: { check: {}, set: {} } } },

  { type: "pg_create_select_permission", args: { source: "default", table: { schema: "public", name: "catalog_sync_lock" }, role: "admin", permission: { columns: SYNC_LOCK_COLUMNS, filter: {}, allow_aggregations: true } } },
  { type: "pg_create_insert_permission", args: { source: "default", table: { schema: "public", name: "catalog_sync_lock" }, role: "admin", permission: { check: {}, set: {} } } },
  { type: "pg_create_update_permission", args: { source: "default", table: { schema: "public", name: "catalog_sync_lock" }, role: "admin", permission: { columns: SYNC_LOCK_COLUMNS.filter(c => c !== "id"), filter: {}, set: {} } } },
  { type: "pg_create_delete_permission", args: { source: "default", table: { schema: "public", name: "catalog_sync_lock" }, role: "admin", permission: { filter: {} } } },

  { type: "pg_create_select_permission", args: { source: "default", table: { schema: "public", name: "catalog_product_snapshots" }, role: "admin", permission: { columns: SNAPSHOT_COLUMNS, filter: {}, allow_aggregations: true } } },
  { type: "pg_create_insert_permission", args: { source: "default", table: { schema: "public", name: "catalog_product_snapshots" }, role: "admin", permission: { check: {}, set: {} } } },

  { type: "pg_create_select_permission", args: { source: "default", table: { schema: "public", name: "catalog_admin_audit_logs" }, role: "admin", permission: { columns: AUDIT_COLUMNS, filter: {}, allow_aggregations: true } } },
  { type: "pg_create_insert_permission", args: { source: "default", table: { schema: "public", name: "catalog_admin_audit_logs" }, role: "admin", permission: { check: {}, set: {} } } },
];

let ok = 0, skip = 0, fail = 0;
for (const perm of permissions) {
  const label = `${perm.args.role}@${perm.args.table.name}/${perm.type.replace("pg_create_", "").replace("_permission", "")}`;
  const r = await applyPermission(perm);
  if (r.ok || r.msg.includes("already exists")) { ok++; console.log(`OK   ${label}`); }
  else { fail++; console.log(`FAIL ${label}: ${r.msg}`); }
}
console.log(`\nRESULT: ok=${ok} skip=${skip} fail=${fail}`);
