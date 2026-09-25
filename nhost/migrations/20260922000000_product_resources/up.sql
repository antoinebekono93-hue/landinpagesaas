-- Marketplace MERCO : ressources numériques liées aux produits du catalogue.
-- Migration additive uniquement.
-- Un produit peut avoir zéro ou plusieurs ressources (fichiers / démos / docs).

-- ── catalog_resources ─────────────────────────────────────────────────────────
create table if not exists catalog_resources (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references catalog_products(id) on delete cascade,
  title text not null,
  description text,
  "type" text not null default 'description',
  access_level text not null default 'public',
  file_path text,
  external_url text,
  version text,
  changelog text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_resources_type_check
    check ("type" in ('hosted_download', 'external_download', 'preview', 'documentation')),
  constraint catalog_resources_access_level_check
    check (access_level in ('public', 'free', 'premium'))
);

create index if not exists catalog_resources_product_order_idx
  on catalog_resources (product_id, is_active, sort_order asc);

-- ── catalog_resource_access_logs (journal réel des accès/téléchargements) ────
create table if not exists catalog_resource_access_logs (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references catalog_resources(id) on delete cascade,
  user_id uuid,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists catalog_resource_access_logs_user_idx
  on catalog_resource_access_logs (user_id, created_at desc);

create index if not exists catalog_resource_access_logs_resource_idx
  on catalog_resource_access_logs (resource_id, created_at desc);

-- ── Trigger updated_at ───────────────────────────────────────────────────────
drop trigger if exists catalog_resources_set_updated_at on catalog_resources;
create trigger catalog_resources_set_updated_at
  before update on catalog_resources
  for each row execute function catalog_set_updated_at();

-- ── Vue publique (anonyme) : jamais de file_path, jamais d'URL interne ───────
drop view if exists public_catalog_resources;
create view public_catalog_resources as
select
  id,
  product_id,
  title,
  description,
  "type",
  access_level,
  external_url,
  version,
  changelog,
  sort_order
from catalog_resources
where is_active = true;