/**
 * Configuration Nhost (sous-domaine + région publiques).
 * Ne contient aucun secret.
 */

export function nhostSubdomain(): string {
  return process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN?.trim() ?? "";
}

export function nhostRegion(): string {
  return process.env.NEXT_PUBLIC_NHOST_REGION?.trim() ?? "";
}

/** Nhost n'est actif que si sous-domaine ET région (publiques) sont renseignés. */
export function isNhostConfigured(): boolean {
  return Boolean(nhostSubdomain() && nhostRegion());
}

/** Endpoint GraphQL Hasura. */
export function nhostGraphqlUrl(): string {
  return `https://${nhostSubdomain()}.hasura.${nhostRegion()}.nhost.run/v1/graphql`;
}

/** Base de l'API Auth Nhost (legacy /v1). */
export function nhostAuthUrl(): string {
  return `https://${nhostSubdomain()}.auth.${nhostRegion()}.nhost.run/v1`;
}