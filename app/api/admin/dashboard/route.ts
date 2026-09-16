import { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/http";
import { adminDashboardStats } from "@/lib/catalog/admin";
import { authorizeAdminRequest, NhostServerError } from "@/lib/nhost/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await authorizeAdminRequest(request);
  } catch (error) {
    if (error instanceof NhostServerError) {
      return apiError(error.message, error.status ?? 401);
    }
    return apiError("Authentification requise.", 401);
  }

  try {
    const stats = await adminDashboardStats();
    return apiOk({ stats });
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Erreur dashboard.",
      500
    );
  }
}