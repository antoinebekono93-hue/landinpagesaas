# Permissions Hasura (Nhost) — Catalogue automatisé

> À appliquer dans la console Nhost > **Database > Hasura** après avoir appliqué
> la migration `nhost/migrations/20260916000000_catalog_core/up.sql` et **tracké**
> les tables/vues suivantes :
> `catalog_products`, `catalog_demo_credentials`, `catalog_sync_runs`,
> `catalog_sync_lock`, `catalog_product_snapshots`, `catalog_admin_audit_logs`,
> `public_catalog_products`, `public_catalog_demo_credentials`.

## Rôle `public` (anonymous) — lecture publique stricte

| Cible | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `public_catalog_products` | ✅ avec filtre `status _nin ["rejected","archived"]` | ❌ | ❌ | ❌ |
| `public_catalog_demo_credentials` | ✅ (vue déjà filtrée) | ❌ | ❌ | ❌ |

- Aucune mutation pour le rôle `public`.
- Le navigateur ne lit QUE les vues publiques (colonnes déjà tronquées).
- Pas d'accès direct aux tables internes pour `public`.

## Rôle `user` (utilisateur connecté)

- Identique au rôle `public` sur les vues.
- Aucun accès aux tables internes (les utilisateurs classiques n'ont pas
  besoin de muter le catalogue).

## Rôle `admin` (seul à pouvoir muter)

| Cible | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `catalog_products` | ✅ | ✅ | ✅ (via colonnes) | ❌ (archivage plutôt) |
| `catalog_demo_credentials` | ✅ | ✅ | ✅ | ✅ (uniquement credentials faux/périmés) |
| `catalog_sync_runs` | ✅ | ✅ | ❌ | ❌ |
| `catalog_sync_lock` | ✅ | ✅ | ✅ | ✅ |
| `catalog_product_snapshots` | ✅ | ✅ | ❌ | ❌ |
| `catalog_admin_audit_logs` | ✅ | ✅ (seulement via API serveur) | ❌ | ❌ |

### Rappels de sécurité

- `license_verified`, `technically_verified`, `commercially_available`,
  `status`, `merco_notes` doivent rester **vides/modélisés par défaut** (`false`
  / `research`) : la sync Envato n'utilise qu'un `on_conflict` avec
  `update_columns` restreint qui ne contient JAMAIS ces champs.
- Les credentials de démo sont ajoutés **manuellement** par l'admin :
  `publicly_published=false` par défaut, passé à `true` uniquement si
  l'auteur les a publiés.
- Interdit dans cette table : secrets Nhost/Envato, purchase codes,
  licence keys, comptes MERCO, comptes clients en production.

## Auth

- Rôles Nhost : `user`, `admin`.
- L'admin est authentifié via Nhost Auth (email/password).
- Le rôle `admin` doit être attribué au compte dans la console Nhost
  (Metadata > Roles / aperçu du user).