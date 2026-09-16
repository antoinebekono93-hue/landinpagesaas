import { redirect } from "next/navigation";
import { currentAdminSession } from "@/lib/nhost/admin-page";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await currentAdminSession();
  if (session.configured) redirect("/admin/catalogue");

  return (
    <main className="mx-auto max-w-md px-4 py-20 text-sm">
      <h1 className="text-center text-xl font-bold text-white">
        Espace admin MERCO
      </h1>
      <p className="mt-3 text-center text-muted">
        Connectez-vous avec un compte Nhost possédant le rôle{" "}
        <code className="font-mono">admin</code>.
      </p>
      <AdminLoginForm className="mt-8" />
    </main>
  );
}