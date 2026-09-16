-- Catalogue SaaS MERCO automatisé — schéma de base.
-- unique index names are chosen so Hasura detects them as constraints.

create extension if not exists "pgcrypto";

-- ── catalog_products ─────────────────────────────────────────────────────────
create table if not exists catalog_products (
  id uuid primary key default gen_random_uuid(),
  envato_item_id text unique not null,
  slug text unique not null,
  title text not null,
  author text,
  description text,
  category_key text not null default 'research',
  envato_category text,
  product_url text not null,
  preview_url text,
  thumbnail_url text,
  regular_price_usd numeric,
  extended_price_usd numeric,
  sales_count integer,
  rating numeric,
  rating_count integer,
  published_at timestamptz,
  updated_at_envato timestamptz,
  last_synced_at timestamptz,
  tech_stack jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  target_customers jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  dependencies jsonb not null default '[]'::jsonb,
  external_costs jsonb not null default '[]'::jsonb,
  multi_tenant_status text not null default 'unknown',
  white_label_status text not null default 'unknown',
  saas_candidate boolean not null default false,
  saas_score integer not null default 0,
  source_verified boolean not null default true,
  license_verified boolean not null default false,
  technically_verified boolean not null default false,
  commercially_available boolean not null default false,
  status text not null default 'research',
  merco_notes text,
  merco_screenshots jsonb not null default '[]'::jsonb,
  source_missing_since timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists catalog_products_envato_item_id_key
  on catalog_products (envato_item_id);
create unique index if not exists catalog_products_slug_key
  on catalog_products (slug);
create index if not exists catalog_products_category_status_idx
  on catalog_products (category_key, status);
create index if not exists catalog_products_score_idx
  on catalog_products (saas_score desc);

-- ── catalog_demo_credentials ─────────────────────────────────────────────────
create table if not exists catalog_demo_credentials (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references catalog_products(id) on delete cascade,
  role text not null,
  username text not null,
  password text not null,
  login_url text,
  source_url text,
  publicly_published boolean not null default false,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_demo_credentials_unique unique (product_id, role)
);

create index if not exists catalog_demo_credentials_product_idx
  on catalog_demo_credentials (product_id);

-- ── catalog_sync_runs ────────────────────────────────────────────────────────
create table if not exists catalog_sync_runs (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running',
  queries_count integer not null default 0,
  items_received integer not null default 0,
  items_created integer not null default 0,
  items_updated integer not null default 0,
  items_unchanged integer not null default 0,
  items_failed integer not null default 0,
  rate_limits integer not null default 0,
  error_message text,
  metadata jsonb
);

create index if not exists catalog_sync_runs_started_at_idx
  on catalog_sync_runs (started_at desc);

-- ── catalog_sync_lock (verrou anti-chevauchenent) ────────────────────────────
create table if not exists catalog_sync_lock (
  id uuid primary key default gen_random_uuid(),
  lock_key text not null unique,
  active boolean not null default false,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── catalog_product_snapshots (historique prix/ventes/notes) ────────────────
create table if not exists catalog_product_snapshots (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references catalog_products(id) on delete cascade,
  price numeric,
  sales integer,
  rating numeric,
  rating_count integer,
  envato_updated_at timestamptz,
  captured_at timestamptz not null default now()
);

create index if not exists catalog_product_snapshots_product_idx
  on catalog_product_snapshots (product_id, captured_at desc);

-- ── catalog_admin_audit_logs (traçabilité admin) ────────────────────────────
create table if not exists catalog_admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null,
  product_id uuid references catalog_products(id) on delete set null,
  action text not null,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists catalog_admin_audit_logs_product_idx
  on catalog_admin_audit_logs (product_id, created_at desc);

-- ── Trigger updated_at ───────────────────────────────────────────────────────
create or replace function catalog_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists catalog_products_set_updated_at on catalog_products;
create trigger catalog_products_set_updated_at
  before update on catalog_products
  for each row execute function catalog_set_updated_at();

drop trigger if exists catalog_demo_credentials_set_updated_at on catalog_demo_credentials;
create trigger catalog_demo_credentials_set_updated_at
  before update on catalog_demo_credentials
  for each row execute function catalog_set_updated_at();

drop trigger if exists catalog_sync_lock_set_updated_at on catalog_sync_lock;
create trigger catalog_sync_lock_set_updated_at
  before update on catalog_sync_lock
  for each row execute function catalog_set_updated_at();

-- ── Vues publiques (accès anonyme uniquement sur ces vues) ──────────────────
-- Impossible d'exposer des champs internes : la vue tronque les colonnes.
drop view if exists public_catalog_products;
create view public_catalog_products as
select
  id,
  envato_item_id,
  slug,
  title,
  author,
  description,
  category_key,
  product_url,
  preview_url,
  thumbnail_url,
  regular_price_usd,
  extended_price_usd,
  sales_count,
  rating,
  rating_count,
  published_at,
  updated_at_envato,
  last_synced_at,
  tech_stack,
  tags,
  target_customers,
  features,
  dependencies,
  external_costs,
  multi_tenant_status,
  white_label_status,
  saas_candidate,
  saas_score,
  status,
  merco_screenshots
from catalog_products
where status not in ('rejected', 'archived');

drop view if exists public_catalog_demo_credentials;
create view public_catalog_demo_credentials as
select
  id,
  product_id,
  role,
  username,
  password,
  login_url,
  source_url
from catalog_demo_credentials
where publicly_published = true;