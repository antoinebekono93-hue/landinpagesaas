import type { Metadata } from "next";

import { ProductServiceCtas } from "@/components/catalog/ProductServiceCtas";

export const metadata: Metadata = {
  title: "Hébergement & abonnement MERCO",
  description:
    "Hébergement managé MERCO Business : sous-domaines automatisés, cloud dédié, SSL illimité, sauvegardes quotidiennes et forfaits réels en FCFA, sans donnée fictive.",
};

export default function HebergementPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
        Abonnement hébergement
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
        Héberger votre SaaS avec MERCO
      </h1>
      <p className="mt-4 leading-relaxed text-slate-300">
        Infrastructure &amp; hébergement managé, sauvegardes quotidiennes et
        forfaits MERCO Business. Les modalités réelles sont confirmées par notre
        équipe, aucune donnée fictive.
      </p>

      <div className="mt-10">
        <ProductServiceCtas productName="votre SaaS" />
      </div>
    </main>
  );
}
