import { isNhostConfigured } from "@/lib/nhost/config";
import { requireAdminPage } from "@/lib/nhost/admin-page";
import { getCatalogCategories } from "@/lib/catalog/source";
import { AdminNotConfigured } from "@/components/admin/AdminNotConfigured";
import { AdminCatalogWorkspace } from "@/components/admin/AdminCatalogWorkspace";

export const dynamic = "force-dynamic";

export default async function AdminCataloguePage() {
  if (!isNhostConfigured()) return <AdminNotConfigured />;
  const session = await requireAdminPage();
  return (
    <AdminCatalogWorkspace
      categories={getCatalogCategories()}
      sessionEmail={session.email}
    />
  );
}