import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/http";
import { authorizeUserRequest, NhostServerError } from "@/lib/nhost/server";
import { getPremiumEntitlement } from "@/lib/catalog/premium";

export const dynamic = "force-dynamic";

/**
 * Entitlement réel du compte MERCO.
 * Retourne l'état authentifié + le statut Premium réel (aucune donnée fictive).
 */
export async function GET(request: NextRequest) {
  let userId: string | null = null;
  let user: { email?: string | null; displayName?: string | null } | null = null;
  try {
    const current = await authorizeUserRequest(request);
    userId = current?.id ?? null;
    user = current
      ? { email: current.email, displayName: current.displayName }
      : null;
  } catch (error) {
    if (error instanceof NhostServerError && error.status === 401) {
      return apiError("Session expirée.", 401, { code: "session-expired" });
    }
    // Token invalide → traité comme utilisateur non connecté (honnête).
  }

  const entitlement = await getPremiumEntitlement(userId);

  return NextResponse.json({
    isAuthenticated: userId !== null,
    user,
    premium: entitlement,
  });
}