-- Rollback de la migration « product_resources » (additive).
drop view if exists public_catalog_resources;
drop trigger if exists catalog_resources_set_updated_at on catalog_resources;
drop table if exists catalog_resource_access_logs;
drop table if exists catalog_resources;