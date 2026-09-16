import { IconLayers } from "./icons";

const examples = [
  "Votre CRM pour PME",
  "Votre plateforme de réservation",
  "Votre outil RH",
  "Votre plateforme e-commerce",
  "Votre SaaS éducatif",
  "Votre logiciel de livraison",
];

export function PossibilitiesSection() {
  return (
    <section className="section-pad border-t border-line">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Projection</p>
          <h2 className="section-title">Un seul abonnement. Plusieurs possibilités.</h2>
          <p className="mt-4 text-muted">
            Chaque SaaS actif peut devenir un service que vous proposez à vos
            propres clients.
          </p>
        </div>

        <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-4">
          <div className="flex flex-1 flex-col items-center gap-3 sm:min-w-[14rem]">
            {examples.slice(0, 3).map((example) => (
              <div
                key={example}
                className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-center text-sm font-medium text-slate-200"
              >
                {example}
              </div>
            ))}
          </div>

          <div className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 shadow-xl shadow-accent/10">
            <div
              aria-hidden="true"
              className="absolute inset-3 rounded-full border border-accent/20"
            />
            <div className="text-center">
              <IconLayers className="mx-auto h-7 w-7 text-accent" />
              <p className="mt-1 text-sm font-bold text-white">MERCO</p>
              <p className="text-[11px] font-medium text-muted">Business</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center gap-3 sm:min-w-[14rem]">
            {examples.slice(3).map((example) => (
              <div
                key={example}
                className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-center text-sm font-medium text-slate-200"
              >
                {example}
              </div>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed text-muted">
          MERCO gère l&apos;infrastructure et la partie technique prévue dans
          votre plan. Vous développez votre marque et votre offre.
        </p>
      </div>
    </section>
  );
}