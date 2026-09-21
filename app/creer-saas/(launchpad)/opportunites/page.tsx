import type { Metadata } from "next";

import { OpportunityBoard } from "@/components/catalog/OpportunityBoard";
import { isSelectionCandidate } from "@/lib/catalog/status";
import {
  getCatalogCategories,
  loadCatalog,
  toCardModel,
} from "@/lib/catalog/source";
import { isEnvatoDataFresh, lastSyncedLabel } from "@/lib/catalog/freshness";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Opportunités – MERCO Launchpad",
  description:
    "Opportunités : les candidats détectés sur Envato Market, du repérage à la disponibilité avec MERCO Business.",
  alternates: {
    canonical: "/creer-saas/opportunites",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/creer-saas/opportunites",
    siteName: "MERCO",
    title: "Opportunités – MERCO Launchpad",
    description:
      "Les candidats SaaS détectés sur Envato Market, de la sélection à la disponibilité avec MERCO Business.",
  },
};

export default async function LaunchpadOpportunitesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const initialCategory =
    category && getCatalogCategories().some((c) => c.key === category)
      ? category
      : "all";
  const { products, mode, lastSyncedAt } = await loadCatalog();
  const opportunities = products
    .filter((product) => isSelectionCandidate(product.status))
    .map(toCardModel);

  const categoryOptions = getCatalogCategories();
  const fresh = mode === "nhost" && isEnvatoDataFresh(lastSyncedAt);

  return (
    <section aria-labelledby="opp-board-title" className="w-full">
      <header className="max-w-3xl">
        <h2 id="opp-board-title" className="text-2xl font-bold tracking-tight text-white">
          Opportunités MERCO
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Le pipeline des candidats SaaS repérés sur Envato Market, de la
          sélection initiale jusqu&apos;à la disponibilité avec un abonnement
          MERCO Business.
        </p>
      </header>

      {mode === "static-fallback" ? (
        <div className="mt-4">
          <div className="rounded-2xl border border-warn/40 bg-warn/10 px-4 py-4 text-sm leading-relaxed text-warn-soft">
            Le catalogue automatique sera activé une fois Nhost et l&apos;API
            Envato configurés. En attendant, les candidats affichés proviennent
            de la recherche MERCO initiale et sont tous à l&apos;étude.
          </div>
        </div>
      ) : null}

      {mode === "nhost" && !fresh ? (
        <div className="mt-4">
          <div className="rounded-2xl border border-warn/40 bg-warn/10 px-4 py-4 text-sm leading-relaxed text-warn-soft">
            Données source en cours de mise à jour. Les informations affichées
            restent celles de la dernière synchronisation Envato.
          </div>
        </div>
      ) : null}

      <div className="mt-6">
        <OpportunityBoard
          products={opportunities}
          categories={categoryOptions}
          initialCategory={initialCategory}
        />
      </div>

      {lastSyncedAt ? (
        <p className="mt-7 text-center text-xs text-muted">
          {lastSyncedLabel(lastSyncedAt)}
        </p>
      ) : null}
    </section>
  );
}