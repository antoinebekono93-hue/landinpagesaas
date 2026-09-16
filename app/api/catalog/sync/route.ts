import { NextRequest } from "next/server";
import { apiError, apiOk, readBearer } from "@/lib/http";
import { syncEnvatoCatalog, SyncConflictError } from "@/lib/catalog/sync-envato";
import { authorizeAdminRequest, NhostServerError } from "@/lib/nhost/server";
import { isNhostConfigured } from "@/lib/nhost/config";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * GET  → cron Vercel (Bearer CRON_SECRET) ou admin Nhost.
 * POST → déclenchement manuel depuis l'admin (Bearer CATALOG_SYNC_SECRET ou admin).
 * Retourne HTTP 409 si une synchronisation est déjà en cours.
 */
async function authorize(request: NextRequest): Promise<true | ReturnType<typeof apiError>> {
  const bearer = readBearer(request);
  const cronSecret = process.env.CRON_SECRET ?? "";
  const syncSecret = process.env.CATALOG_SYNC_SECRET ?? "";

  // Cron Vercel envoie ce header ; il ne circule pas via le réseau public.
  if (request.headers.get("x-vercel-cron") === "true") return true;
  if (cronSecret && bearer === cronSecret) return true;
  if (syncSecret && bearer === syncSecret) return true;

  try {
    await authorizeAdminRequest(request);
    return true;
  } catch (error) {
    if (error instanceof NhostServerError) {
      return apiError(error.message, error.status ?? 401);
    }
    return apiError("Authentification requise.", 401);
  }
}

async function runSync() {
  if (!isNhostConfigured()) {
    return apiError(
      "Nhost n'est pas configuré (NEXT_PUBLIC_NHOST_SUBDOMAIN / NEXT_PUBLIC_NHOST_REGION).",
      503
    );
  }
  if (!process.env.ENVATO_API_TOKEN) {
    return apiError("ENVATO_API_TOKEN manquant (serveur uniquement).", 503);
  }
  try {
    const report = await syncEnvatoCatalog();
    return apiOk(report);
  } catch (error) {
    if (error instanceof SyncConflictError) {
      return apiError(error.message, 409);
    }
    return apiError(
      error instanceof Error ? error.message : "Échec de la synchronisation.",
      500
    );
  }
}

export async function GET(request: NextRequest) {
  const auth = await authorize(request);
  if (auth !== true) return auth;
  return runSync();
}

export async function POST(request: NextRequest) {
  const auth = await authorize(request);
  if (auth !== true) return auth;
  return runSync();
}