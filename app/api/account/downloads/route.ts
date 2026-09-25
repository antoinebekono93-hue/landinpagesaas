import { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/http";
import { authorizeUserRequest, NhostServerError } from "@/lib/nhost/server";
import { listUserDownloads } from "@/lib/catalog/resource-access";

export const dynamic = "force-dynamic";

/**
 * Historique réel des accès/téléchargements de l'utilisateur connecté.
 * Rien d'inventé : seuls les accès vérifiés côté serveur sont listés.
 */
export async function GET(request: NextRequest) {
  let user;
  try {
    user = await authorizeUserRequest(request);
  } catch (error) {
    if (error instanceof NhostServerError) {
      return apiError(error.message, error.status ?? 401);
    }
    return apiError("Authentification requise.", 401);
  }
  if (!user) {
    return apiError("Authentification requise.", 401, {
      code: "authentication-required",
    });
  }

  const limitRaw = new URL(request.url).searchParams.get("limit");
  const limit = Math.min(Math.max(Number(limitRaw) || 50, 1), 200);
  const downloads = await listUserDownloads(user.id, limit);
  return apiOk({ downloads });
}