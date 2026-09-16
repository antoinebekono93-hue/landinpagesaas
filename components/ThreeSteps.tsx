import {
  IconCart,
  IconCheck,
  IconLayers,
  IconRocket,
  IconUsers,
} from "./icons";

const steps = [
  {
    title: "Choisissez vos SaaS",
    text: "Sélectionnez 2 ou 5 solutions parmi le catalogue MERCO éligible.",
    icon: <IconLayers className="h-6 w-6" />,
  },
  {
    title: "MERCO les met en ligne",
    text: "Nous gérons la mise en ligne et l'environnement d'hébergement prévu par votre plan.",
    icon: <IconRocket className="h-6 w-6" />,
  },
  {
    title: "Vous trouvez vos clients",
    text: "Construisez vos offres et commercialisez vos services selon les conditions applicables à chaque solution.",
    icon: <IconUsers className="h-6 w-6" />,
  },
];

export function ThreeSteps() {
  return (
    <section id="comment" className="section-pad border-t border-line">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Le modèle</p>
          <h2 className="section-title">Votre business en 3 étapes</h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="card relative p-6">
              <span
                aria-hidden="true"
                className="absolute right-6 top-6 text-4xl font-bold text-line-soft/60"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                {step.icon}
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.text}
              </p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-2xl text-center">
          <p className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-line-soft bg-surface px-5 py-2.5 text-sm font-semibold text-slate-100">
            <IconCart className="h-4 w-4 text-accent" />
            Vous n&apos;avez plus besoin de passer des mois à développer chaque
            produit.
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href="#catalogue"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line-soft bg-surface px-7 py-3.5 text-base font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
            >
              <IconCheck className="h-5 w-5 text-accent" />
              Découvrir le catalogue
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}