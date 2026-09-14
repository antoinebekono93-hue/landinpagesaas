import { IconCheck } from "./icons";

const points = [
  "équipe de 12 développeurs",
  "veille régulière",
  "bibliothèque organisée par catégories",
  "démonstration disponible avant achat",
  "accès à vie",
  "accompagnement après activation",
];

export function Trust() {
  return (
    <section className="section-pad border-t border-line bg-surface/[0.35]">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Confiance</p>
          <h2 className="section-title">Pourquoi faire confiance à MERCO ?</h2>
        </div>

        <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          {points.map((point) => (
            <li
              key={point}
              className="flex items-center gap-3 rounded-xl border border-line bg-surface px-5 py-4 text-sm font-medium text-slate-200"
            >
              <IconCheck className="h-5 w-5 shrink-0 text-accent" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}