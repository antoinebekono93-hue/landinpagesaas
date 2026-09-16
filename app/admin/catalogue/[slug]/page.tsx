import { notFound } from "next/navigation";
import { isNhostConfigured } from "@/lib/nhost/config";
import { requireAdminPage } from "@/lib/nhost/admin-page";
import { adminGetProductBySlug, adminGetProductCredentials } from "@/lib/catalog/admin";
import { getCatalogCategories } from "@/lib/catalog/source";
import { AdminNotConfigured } from "@/components/admin/AdminNotConfigured";
import { AdminProductDetail } from "@/components/admin/AdminProductDetail";

export const dynamic = "force-dynamic";

export default async function AdminProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isNhostConfigured()) return <AdminNotConfigured />;
  const session = await requireAdminPage();
  const { slug } = await params;
  const product = await adminGetProductBySlug(slug);
  if (!product) notFound();
  const credentials = await adminGetProductCredentials(product.id);

  return (
    <AdminProductDetail
      product={product}
      credentials={credentials}
      categories={getCatalogCategories()}
      sessionEmail={session.email}
    />
  );
}