-- Rollback du schéma catalogue.
drop view if exists public_catalog_demo_credentials;
drop view if exists public_catalog_products;

drop trigger if exists catalog_sync_lock_set_updated_at on catalog_sync_lock;
drop trigger if exists catalog_demo_credentials_set_updated_at on catalog_demo_credentials;
drop trigger if exists catalog_products_set_updated_at on catalog_products;
drop function if exists catalog_set_updated_at();

drop table if exists catalog_admin_audit_logs;
drop table if exists catalog_product_snapshots;
drop table if exists catalog_sync_lock;
drop table if exists catalog_sync_runs;
drop table if exists catalog_demo_credentials;
drop table if exists catalog_products;