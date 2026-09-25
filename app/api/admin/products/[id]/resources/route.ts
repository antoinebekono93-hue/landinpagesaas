import { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/http";
import {
  adminDeleteResource,
  adminUpsertResource,
  isResourceAccessLevel,
  isResourceType,
  type ResourceInput,
} from "@/lib/catalog/admin-resources";
import { authorizeAdminRequest, NhostServerError } from "@/lib/nhost/server";

export const dynamic = "force-dynamic";

type Body = {
  resourceId?: string;
  title?: string;
  description?: string | null;
  type?: string;
  access_level?: string;
  file_path?: string | null;
  external_url?: string | null;
  version?: string | null;
  changelog?: string | null;
  is_active?: boolean;
  sort_order?: number;
};

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

function toResourceInput(body: Body): ResourceInput | null {
  if (!body.title || !body.title.trim()) return null;
  if (!body.type || !isResourceType(body.type)) return null;
  if (!body.access_level || !isResourceAccessLevel(body.access_level)) return null;
  return {
    title: body.title.trim(),
    description: body.description ?? null,
    type: body.type,
    access_level: body.access_level,
    file_path: body.file_path ?? null,
    external_url: body.external_url ?? null,
    version: body.version ?? null,
    changelog: body.changelog ?? null,
    is_active: body.is_active !== false,
    sort_order: Number.isFinite(Number(body.sort_order))
      ? Math.max(0, Math.round(Number(body.sort_order)))
      : 0,
  };
}

/** Ajout manuel d'une ressource numérique liée au produit (`productId`). */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await authorize(request);
  if (admin instanceof Response) return admin;
  const { id } = await params;

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return apiError("Corps JSON invalide.", 400);
  }
  const input = toResourceInput(body);
  if (!input) {
    return apiError(
      "title, type et access_level sont obligatoires (type et accès valides).",
      400
    );
  }

  try {
    const resource = await adminUpsertResource(admin.id, id, input);
    return apiOk({ resource }, { status: 201 });
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Erreur d'ajout.",
      400
    );
  }
}

/** Mise à jour d'une ressource existante. */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await authorize(request);
  if (admin instanceof Response) return admin;
  const { id } = await params;

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return apiError("Corps JSON invalide.", 400);
  }
  const input = toResourceInput(body);
  if (!input || !body.resourceId) {
    return apiError(
      "resourceId, title, type et access_level sont requis.",
      400
    );
  }

  try {
    const resource = await adminUpsertResource(
      admin.id,
      id,
      input,
      body.resourceId
    );
    return apiOk({ resource });
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Erreur de mise à jour.",
      400
    );
  }
}

/** Suppression d'une ressource. */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await authorize(request);
  if (admin instanceof Response) return admin;
  void (await params);

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return apiError("Corps JSON invalide.", 400);
  }
  if (!body.resourceId) return apiError("resourceId requis.", 400);

  try {
    await adminDeleteResource(admin.id, body.resourceId);
    return apiOk({ ok: true });
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Erreur de suppression.",
      400
    );
  }
}