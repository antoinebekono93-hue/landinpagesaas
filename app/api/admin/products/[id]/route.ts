import { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/http";
import {
  adminGetProductById,
  adminGetProductCredentials,
  adminUpdateProduct,
} from "@/lib/catalog/admin";
import { authorizeAdminRequest, NhostServerError } from "@/lib/nhost/server";

export const dynamic = "force-dynamic";

const UPDATABLE_FIELDS = [
  "category_key",
  "multi_tenant_status",
  "white_label_status",
  "tech_stack",
  "target_customers",
  "features",
  "dependencies",
  "external_costs",
  "merco_notes",
  "merco_screenshots",
  "technically_verified",
  "license_verified",
  "commercially_available",
  "status",
] as const;

async function authorize(request: NextRequest) {
  try {
    return await authorizeAdminRequest(request);
  } catch (error) {
    if (error instanceof NhostServerError) {
      return apiError(error.message, error.status ?? 401);
    }
    return apiError("Authentification requise.", 401);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await authorize(request);
  if (admin instanceof Response) return admin;
  const { id } = await params;
  try {
    const [product, credentials] = await Promise.all([
      adminGetProductById(id),
      adminGetProductCredentials(id),
    ]);
    if (!product) return apiError("Produit introuvable.", 404);
    return apiOk({ product, credentials });
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Erreur de lecture.",
      500
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await authorize(request);
  if (admin instanceof Response) return admin;
  const { id } = await params;

  let body: Record<string, unknown> & { license_confirmation?: boolean };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return apiError("Corps JSON invalide.", 400);
  }

  const patch: Record<string, unknown> = {};
  for (const field of UPDATABLE_FIELDS) {
    if (field in body) patch[field] = body[field];
  }
  if (Object.keys(patch).length === 0) {
    return apiError("Aucun champ modifiable fourni.", 400);
  }

  // Confirmation explicite obligatoire avant de valider une licence.
  if (patch.license_verified === true && body.license_confirmation !== true) {
    return apiError(
      "Confirmation requise : « Je confirme avoir vérifié les droits/licence nécessaires pour l'utilisation MERCO. »",
      400
    );
  }

  try {
    const product = await adminUpdateProduct(id, admin.id, patch);
    return apiOk({ product });
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Erreur de mise à jour.",
      400
    );
  }
}