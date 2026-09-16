import { IconGauge, IconRefresh, IconShield } from "./icons";

const details = [
  "CPU",
  "RAM",
  "stockage",
  "trafic",
  "nombre de domaines",
  "backups",
];

export function HostingTransparency() {
  return (
    <section className="section-pad border-t border-line bg-surface/[0.35]">
      <div className="container-page">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-line bg-surface p-7 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-saas/30 bg-saas/10 text-saas">
                  <IconGauge className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Hébergement
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Hébergement inclus selon les ressources et limites du plan.
                    Les limites précises (CPU, RAM, stockage, trafic, domaines,
                    backups) seront communiquées selon l&apos;offre en vigueur.
                  </p>
                </div>
              </div>
              <ul className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                {details.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line-soft bg-surface-2 px-3 py-1.5 text-xs font-medium text-slate-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:gap-6">
              <p className="flex items-center gap-2 text-xs text-muted">
                <IconShield className="h-4 w-4 shrink-0 text-accent" />
                SSL inclus selon le plan
              </p>
              <p className="flex items-center gap-2 text-xs text-muted">
                <IconRefresh className="h-4 w-4 shrink-0 text-accent" />
                Maintenance technique de base incluse
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}