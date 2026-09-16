import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/http";
import {
  ADMIN_COOKIE_NAME,
  NhostServerError,
  readAdminCookie,
  verifyAdminToken,
} from "@/lib/nhost/server";

export const dynamic = "force-dynamic";

const COOKIE_MAX_AGE = 7 * 86400;

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}

/** POST { token } : valide le JWT Nhost puis crée la session admin (cookie httpOnly). */
export async function POST(request: NextRequest) {
  let body: { token?: string };
  try {
    body = (await request.json()) as { token?: string };
  } catch {
    return apiError("Corps JSON invalide.", 400);
  }
  const token = body.token?.trim();
  if (!token) return apiError("Token manquant.", 400);

  try {
    const user = await verifyAdminToken(token);
    const response = NextResponse.json({ user });
    response.cookies.set(ADMIN_COOKIE_NAME, token, cookieOptions());
    return response;
  } catch (error) {
    if (error instanceof NhostServerError) {
      return apiError(error.message, error.status ?? 401);
    }
    return apiError("Session invalide.", 401);
  }
}

/** GET : renvoie l'admin courant (ou 401). */
export async function GET(request: NextRequest) {
  const token = readAdminCookie(request);
  if (!token) return apiError("Non connecté.", 401);
  try {
    const user = await verifyAdminToken(token);
    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof NhostServerError) {
      return apiError(error.message, error.status ?? 401);
    }
    return apiError("Session invalide.", 401);
  }
}

/** DELETE : déconnecte (supprime le cookie). */
export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    ...cookieOptions(),
    maxAge: 0,
  });
  return response;
}