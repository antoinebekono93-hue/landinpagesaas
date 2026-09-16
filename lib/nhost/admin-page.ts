import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isNhostConfigured } from "./config";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "./server";

/**
 * Garde des pages admin (Server Components).
 * - Nhost non configuré → renvoie `{ configured: false }`.
 * - Non connecté / rôle non-admin → redirect `/admin/login`.
 */

export type AdminPageSession =
  | { configured: false }
  | { configured: true; id: string; email: string | null; roles: string[] };

export async function currentAdminSession(): Promise<AdminPageSession> {
  if (!isNhostConfigured()) return { configured: false };
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value ?? null;
  if (!token) return { configured: false };
  try {
    const user = await verifyAdminToken(token);
    return {
      configured: true,
      id: user.id,
      email: user.email ?? null,
      roles: user.roles,
    };
  } catch {
    return { configured: false };
  }
}

/** Exige une session admin valide ou redirige vers `/admin/login`. */
export async function requireAdminPage(): Promise<Exclude<
  AdminPageSession,
  { configured: false }
>> {
  const session = await currentAdminSession();
  if (!session.configured) redirect("/admin/login");
  return session;
}