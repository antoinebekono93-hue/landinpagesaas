import { IconCheck, IconX } from "./icons";

const fromScratch = [
  "conception",
  "développement",
  "déploiement",
  "configuration serveur",
  "maintenance",
  "mises à jour",
  "temps avant lancement",
];

const withMerco = [
  "choisir une solution",
  "mise en ligne accompagnée",
  "hébergement prévu par le plan",
  "maintenance technique de base",
  "plusieurs SaaS dans un même abonnement",
  "lancement beaucoup plus simple",
];

export function ComparisonTable() {
  return (
    <section className="section-pad border-t border-line bg-surface/[0.35]">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Comparatif</p>
          <h2 className="section-title">
            Développer de zéro ou lancer avec MERCO ?
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          <article className="card p-6 sm:p-7">
            <h3 className="text-base font-semibold text-muted">
              Développer de zéro
            </h3>
            <ul className="mt-5 space-y-3">
              {fromScratch.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted">
                  <IconX className="mt-0.5 h-4 w-4 shrink-0 text-muted/50" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="card relative overflow-hidden border-accent/40 p-6 sm:p-7">
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-2xl"
            />
            <h3 className="flex items-center gap-2 text-base font-semibold text-white">
              <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-accent">
                MERCO Business
              </span>
            </h3>
            <ul className="mt-5 space-y-3">
              {withMerco.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-200">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted">
          Les délais et temps de lancement dépendent de chaque solution et des
          conditions en vigueur. Demandez un aperçu avant de souscrire.
        </p>
      </div>
    </section>
  );
}