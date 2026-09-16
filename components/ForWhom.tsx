import { IconBuilding, IconCode, IconUsers } from "./icons";

const profiles = [
  {
    title: "Entrepreneur",
    text: "Choisissez vos solutions et concentrez-vous sur les clients.",
    icon: <IconUsers className="h-6 w-6" />,
  },
  {
    title: "Agence",
    text: "Ajoutez plusieurs services SaaS à votre catalogue.",
    icon: <IconBuilding className="h-6 w-6" />,
  },
  {
    title: "Développeur / freelance",
    text: "Gagnez du temps en utilisant des infrastructures et solutions déjà disponibles.",
    icon: <IconCode className="h-6 w-6" />,
  },
];

export function ForWhom() {
  return (
    <section className="section-pad border-t border-line">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Pour qui ?</p>
          <h2 className="section-title">
            Vous n&apos;avez pas besoin d&apos;être développeur.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <article key={profile.title} className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-saas/30 bg-saas/10 text-saas">
                {profile.icon}
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">
                {profile.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {profile.text}
              </p>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-xl rounded-2xl border border-accent/30 bg-accent/[0.06] px-6 py-4 text-center text-sm font-medium leading-relaxed text-slate-100">
          MERCO s&apos;occupe de la partie technique prévue dans votre
          abonnement.
        </p>
      </div>
    </section>
  );
}