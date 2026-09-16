import { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/http";
import { adminListProducts, type AdminProductFilters } from "@/lib/catalog/admin";
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

  const params = request.nextUrl.searchParams;
  const parseBool = (value: string | null) =>
    value === null ? undefined : value === "true";

  const filters: AdminProductFilters = {
    category: params.get("category") ?? undefined,
    status: params.get("status") ?? undefined,
    search: params.get("search") ?? undefined,
    author: params.get("author") ?? undefined,
    license: parseBool(params.get("license")),
    technical: parseBool(params.get("technical")),
    commercial: parseBool(params.get("commercial")),
    preview: parseBool(params.get("preview")),
    limit: params.get("limit") ? Number(params.get("limit")) : undefined,
    offset: params.get("offset") ? Number(params.get("offset")) : undefined,
  };

  try {
    const products = await adminListProducts(filters);
    return apiOk({ products });
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Erreur lors de la lecture.",
      500
    );
  }
}