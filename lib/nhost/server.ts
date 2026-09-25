import "server-only";
import { isNhostConfigured, nhostAuthUrl, nhostGraphqlUrl } from "./config";

/**
 * Accès Nhost côté serveur uniquement.
 * - `NHOST_ADMIN_SECRET` n'est JAMAIS exporté et ne quitte pas le serveur.
 * - Toutes les écritures sensibles passent par ici avec le rôle admin.
 */

export class NhostServerError extends Error {
  code: "not-configured" | "unauthorized" | "forbidden" | "graphql" | "network";
  status?: number;

  constructor(
    message: string,
    code: NhostServerError["code"],
    status?: number
  ) {
    super(message);
    this.name = "NhostServerError";
    this.code = code;
    this.status = status;
  }
}

function requireNhost() {
  if (!isNhostConfigured()) {
    throw new NhostServerError(
      "Nhost n'est pas configuré (NEXT_PUBLIC_NHOST_SUBDOMAIN / NEXT_PUBLIC_NHOST_REGION).",
      "not-configured"
    );
  }
}

function requireAdminSecret(): string {
  const secret = process.env.NHOST_ADMIN_SECRET;
  if (!secret) {
    throw new NhostServerError(
      "NHOST_ADMIN_SECRET manquant (serveur uniquement).",
      "not-configured"
    );
  }
  return secret;
}

type GraphQLResult<T> = { data?: T; errors?: Array<{ message?: string }> };

/** Requête GraphQL Hasura avec le rôle admin (secret serveur). */
export async function nhostGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  requireNhost();
  const adminSecret = requireAdminSecret();
  const response = await fetch(nhostGraphqlUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": adminSecret,
    },
    body: JSON.stringify({ query, variables: variables ?? {} }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new NhostServerError(
      `GraphQL Nhost a répondu ${response.status}.`,
      "graphql",
      response.status
    );
  }
  const body = (await response.json()) as GraphQLResult<T>;
  if (body.errors && body.errors.length > 0) {
    const first = body.errors[0]?.message ?? "Erreur GraphQL inconnue.";
    throw new NhostServerError(`GraphQL Nhost : ${first}`, "graphql");
  }
  if (body.data === undefined) {
    throw new NhostServerError(
      "GraphQL Nhost : aucune donnée retournée.",
      "graphql"
    );
  }
  return body.data;
}

/* ─────────────────────────── Auth admin ─────────────────────────── */

export type NhostAuthUser = {
  id: string;
  email?: string | null;
  displayName?: string | null;
  defaultRole?: string;
  roles: string[];
};

/** Valide un JWT Nhost auprès du serveur Auth (+ rôle `admin` requis). */
export async function verifyAdminToken(token: string): Promise<NhostAuthUser> {
  if (!token) {
    throw new NhostServerError("Token manquant.", "unauthorized", 401);
  }
  requireNhost();

  const response = await fetch(`${nhostAuthUrl()}/user`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    throw new NhostServerError(
      "Session Nhost invalide ou expirée.",
      "unauthorized",
      401
    );
  }
  if (!response.ok) {
    throw new NhostServerError(
      `Le serveur Auth Nhost a répondu ${response.status}.`,
      "graphql",
      response.status
    );
  }

  let data: Record<string, unknown>;
  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    throw new NhostServerError(
      "Réponse Auth Nhost invalide.",
      "graphql",
      502
    );
  }

  const rawRoles = Array.isArray(data.allowed_roles)
    ? (data.allowed_roles as string[])
    : Array.isArray(data.roles)
      ? (data.roles as string[])
      : [];
  const roles = rawRoles
    .map((role) => String(role).toLowerCase())
    .filter((role) => role.length > 0);

  if (!roles.includes("admin")) {
    throw new NhostServerError(
      "Le rôle admin est requis.",
      "forbidden",
      403
    );
  }

  return {
    id: String(data.id ?? ""),
    email:
      typeof data.email === "string" ? data.email : (data.email as string | null ?? null),
    displayName:
      typeof data.displayName === "string"
        ? data.displayName
        : ((data.display_name as string | null | undefined) ?? null),
    defaultRole:
      typeof data.default_role === "string" ? data.default_role : undefined,
    roles,
  };
}

/** Extrait et valide un Bearer admin depuis une requête HTTP. */
export async function authorizeAdminRequest(
  request: Request
): Promise<NhostAuthUser> {
  const authorization = request.headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
  if (!token) {
    const cookieToken = readAdminCookie(request);
    if (cookieToken) {
      return verifyAdminToken(cookieToken);
    }
    throw new NhostServerError("Authentification requise.", "unauthorized", 401);
  }
  return verifyAdminToken(token);
}

/** Valide un JWT Nhost auprès du serveur Auth (role quelconque, pas admin). */
export async function verifyUserToken(token: string): Promise<NhostAuthUser> {
  if (!token) {
    throw new NhostServerError("Token manquant.", "unauthorized", 401);
  }
  requireNhost();

  const response = await fetch(`${nhostAuthUrl()}/user`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    throw new NhostServerError(
      "Session Nhost invalide ou expirée.",
      "unauthorized",
      401
    );
  }
  if (!response.ok) {
    throw new NhostServerError(
      `Le serveur Auth Nhost a répondu ${response.status}.`,
      "graphql",
      response.status
    );
  }

  let data: Record<string, unknown>;
  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    throw new NhostServerError(
      "Réponse Auth Nhost invalide.",
      "graphql",
      502
    );
  }

  return {
    id: String(data.id ?? ""),
    email:
      typeof data.email === "string"
        ? data.email
        : ((data.email as string | null) ?? null),
    displayName:
      typeof data.displayName === "string"
        ? data.displayName
        : ((data.display_name as string | null | undefined) ?? null),
    defaultRole:
      typeof data.default_role === "string" ? data.default_role : undefined,
    roles: [],
  };
}

/** Demande un Bearer utilisateur (tout utilisateur authentifié) depuis une requête. */
export async function authorizeUserRequest(
  request: Request
): Promise<NhostAuthUser | null> {
  const authorization = request.headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
  if (!token) return null;
  return verifyUserToken(token);
}

/** Lit le cookie de session admin s'il existe. */
export function readAdminCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(/(?:^|;\s*)merco_admin=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export const ADMIN_COOKIE_NAME = "merco_admin";