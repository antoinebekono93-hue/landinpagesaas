import type { Metadata } from "next";

import { ProductCard } from "@/components/catalog/ProductCard";
import { isSelectionCandidate } from "@/lib/catalog/status";
import { loadCatalog, toCardModel } from "@/lib/catalog/source";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Opportunités Launchpad – Sélection MERCO",
  description:
    "Les opportunités SaaS MERCO : candidats à l'étude, audits techniques et licences en vérification.",
};

export default async function LaunchpadOpportunitesPage() {
  const { products } = await loadCatalog();
  const opportunities = products
    .filter((product) => isSelectionCandidate(product.status))
    .sort((a, b) => b.saasScore - a.saasScore)
    .map(toCardModel);

  return (
    <section aria-labelledby="lp-opp-title" className="w-full">
      <header className="max-w-2xl">
        <h2 id="lp-opp-title" className="text-2xl font-bold tracking-tight text-white">
          Opportunités MERCO
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Les candidats prioritaires, classés par score MERCO. Un candidat
          devient opportunité commerciale uniquement après validation
          manuelle licence et technique.
        </p>
      </header>

      <p className="mt-5 text-xs text-muted">
        {opportunities.length} opportunité{opportunities.length > 1 ? "s" : ""}{" "}
        à l&apos;étude
      </p>

      {opportunities.length > 0 ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {opportunities.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              location="launchpad_opportunites"
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-line-soft bg-surface-2 p-8 text-center text-sm text-muted">
          Aucune opportunité pour le moment. Revenez après la prochaine
          synchronisation Envato.
        </div>
      )}
    </section>
  );
}