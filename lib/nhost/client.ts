import { createClient, type NhostClient } from "@nhost/nhost-js";
import { nhostRegion, nhostSubdomain } from "./config";

/**
 * Client Nhost côté client (login admin, utilisateurs).
 * Utilise uniquement les valeurs publiques (sous-domaine + région).
 * Aucun secret ici : ne pas y importer NHOST_ADMIN_SECRET ni un token.
 */

declare global {
  // eslint-disable-next-line no-var
  var __mercoNhostClient: NhostClient | undefined;
}

export function getNhostClient(): NhostClient {
  if (globalThis.__mercoNhostClient) return globalThis.__mercoNhostClient;
  const client = createClient({
    subdomain: nhostSubdomain(),
    region: nhostRegion(),
  });
  globalThis.__mercoNhostClient = client;
  return client;
}