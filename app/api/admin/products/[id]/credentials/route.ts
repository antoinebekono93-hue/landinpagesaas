import { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/http";
import {
  adminDeleteCredential,
  adminUpsertCredential,
  type CredentialInput,
} from "@/lib/catalog/admin";
import { authorizeAdminRequest, NhostServerError } from "@/lib/nhost/server";

export const dynamic = "force-dynamic";

type Body = {
  credentialId?: string;
  role?: string;
  username?: string;
  password?: string;
  login_url?: string | null;
  source_url?: string | null;
  publicly_published?: boolean;
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

function toCredentialInput(body: Body): CredentialInput | null {
  if (!body.role || !body.username || !body.password) return null;
  return {
    role: body.role.trim(),
    username: body.username,
    password: body.password,
    login_url: body.login_url ?? null,
    source_url: body.source_url ?? null,
    publicly_published: body.publicly_published === true,
  };
}

/** Ajout manuel d'identifiants publics de démonstration (jamais générés). */
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
  const input = toCredentialInput(body);
  if (!input) {
    return apiError("role, username et password sont obligatoires.", 400);
  }

  try {
    const credential = await adminUpsertCredential(admin.id, id, input);
    return apiOk({ credential }, { status: 201 });
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Erreur d'ajout.",
      400
    );
  }
}

/** Mise à jour d'un identifiant existant. */
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
  const input = toCredentialInput(body);
  if (!input || !body.credentialId) {
    return apiError("credentialId, role, username et password requis.", 400);
  }

  try {
    const credential = await adminUpsertCredential(
      admin.id,
      id,
      input,
      body.credentialId
    );
    return apiOk({ credential });
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Erreur de mise à jour.",
      400
    );
  }
}

/** Suppression d'un identifiant. */
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
  if (!body.credentialId) return apiError("credentialId requis.", 400);

  try {
    await adminDeleteCredential(admin.id, body.credentialId);
    return apiOk({ ok: true });
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Erreur de suppression.",
      400
    );
  }
}