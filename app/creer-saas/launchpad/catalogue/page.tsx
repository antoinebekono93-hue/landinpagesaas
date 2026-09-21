import type { Metadata } from "next";

import { CatalogExplorer } from "@/components/catalog/CatalogExplorer";
import { LaunchpadShell } from "@/components/launchpad/shell/LaunchpadShell";
import {
  getCatalogCategories,
  loadCatalog,
  toCardModel,
} from "@/lib/catalog/source";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catalogue Launchpad – Solutions SaaS MERCO",
  description:
    "Découvrez les SaaS prêts à lancer avec MERCO Launchpad : CRM, e-commerce, RH, réservation, logistique et plus encore.",
};

const EXCLUDED_STATUSES = ["rejected", "archived"];

export default async function LaunchpadCataloguePage() {
  const { products, mode } = await loadCatalog();
  const cards = products
    .filter((product) => !EXCLUDED_STATUSES.includes(product.status))
    .map(toCardModel);
  const categories = getCatalogCategories();

  return (
    <LaunchpadShell
      title="Catalogue"
      crumbs={[
        { label: "Launchpad", href: "/creer-saas/launchpad/decouvrir" },
        { label: "Catalogue" },
      ]}
    >
      <section aria-labelledby="lp-catalogue-title" className="w-full">
        <header className="max-w-2xl">
          <h2 id="lp-catalogue-title" className="text-2xl font-bold tracking-tight text-white">
            Catalogue SaaS prêts à lancer
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Les candidats détectés sur Envato Market sont scorés par MERCO.
            Ceux disponibles commercialement sont activés pour votre business.
          </p>
        </header>

        {mode === "static-fallback" ? (
          <div className="mt-5 rounded-2xl border border-warn/40 bg-warn/10 px-4 py-4 text-sm leading-relaxed text-warn-soft">
            Le catalogue automatique sera activé une fois Nhost et l&apos;API
            Envato configurés. En attendant, voici les candidats détectés lors
            de la recherche MERCO.
          </div>
        ) : null}

        <div className="mt-6">
          <CatalogExplorer products={cards} categories={categories} />
        </div>
      </section>
    </LaunchpadShell>
  );
}