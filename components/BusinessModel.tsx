import { IconShield } from "./icons";

const models = [
  "Abonnement mensuel",
  "Abonnement annuel",
  "Frais de mise en service",
  "Service accompagné",
];

export function BusinessModel() {
  return (
    <section className="section-pad border-t border-line bg-surface/[0.35]">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Modèle économique</p>
          <h2 className="section-title">Comment gagner de l&apos;argent avec votre SaaS ?</h2>
          <p className="mt-4 leading-relaxed text-muted">
            Vous définissez votre propre offre commerciale et cherchez vos
            propres clients. Selon le produit et ses conditions
            d&apos;utilisation, vous pouvez proposer l&apos;accès à votre
            service sous forme d&apos;abonnement ou de prestation.
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-3">
          {models.map((model) => (
            <span
              key={model}
              className="rounded-full border border-line-soft bg-surface px-5 py-2.5 text-sm font-semibold text-slate-100"
            >
              {model}
            </span>
          ))}
        </div>

        <p className="mx-auto mt-8 flex max-w-xl items-start justify-center gap-2 rounded-2xl border border-line bg-surface px-6 py-4 text-center text-sm font-medium leading-relaxed text-muted">
          <IconShield className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          MERCO ne garantit aucun revenu ni nombre de clients.
        </p>
      </div>
    </section>
  );
}