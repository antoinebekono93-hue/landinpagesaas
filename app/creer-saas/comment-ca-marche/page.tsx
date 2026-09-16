import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { IconCheck } from "@/components/icons";

export const metadata: Metadata = {
  title: "Comment fonctionne MERCO Business ?",
  description:
    "Découvrez le parcours MERCO Business : choisissez votre plan, sélectionnez vos SaaS, MERCO prépare la mise en ligne, vous configurez votre offre et vous trouvez vos clients.",
  alternates: {
    canonical: "/creer-saas/comment-ca-marche",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/creer-saas/comment-ca-marche",
    siteName: "MERCO",
    title: "Comment fonctionne MERCO Business ?",
    description:
      "Choisissez votre plan, sélectionnez vos SaaS, MERCO prépare la mise en ligne, vous configurez votre offre et vous trouvez vos clients.",
  },
};

const crumbs = [
  { label: "MERCO", href: "/" },
  { label: "Business SaaS", href: "/creer-saas" },
  { label: "Comment ça marche", current: true },
];

const steps = [
  {
    title: "Choisissez votre plan",
    text: "Starter (2 SaaS) ou Pro (5 SaaS), selon le nombre de services que vous souhaitez lancer.",
  },
  {
    title: "Choisissez vos SaaS",
    text: "Sélectionnez vos solutions depuis le catalogue vérifié MERCO.",
  },
  {
    title: "MERCO prépare la mise en ligne",
    text: "La mise en ligne est préparée selon l'infrastructure et les limites du plan.",
  },
  {
    title: "Configurez votre offre",
    text: "Nom, positionnement, prix, cible : vous définissez votre service.",
  },
  {
    title: "Trouvez vos clients",
    text: "Vous gérez votre propre commercialisation et votre relation client.",
  },
];

const mercoHandles = [
  "mise en ligne de vos SaaS",
  "hébergement selon les limites du plan",
  "SSL",
  "maintenance technique de base",
  "orientation sur le catalogue",
];

const youHandle = [
  "marketing",
  "prix",
  "clients",
  "contenu",
  "support commercial",
  "paiements clients",
];

export default function CommentPage() {
  return (
    <PageShell crumbs={crumbs} location="breadcrumbs_comment">
      <section className="container-page py-10 sm:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            De l&apos;idée au SaaS en quelques étapes
          </h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
            Un parcours simple, pensé pour les entrepreneurs comme pour les
            profils techniques.
          </p>
        </div>

        <ol className="mx-auto mt-12 max-w-2xl space-y-4">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-base font-bold text-accent">
                  {index + 1}
                </span>
                {index < steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="mt-1 w-px flex-1 bg-line"
                  />
                ) : null}
              </div>
              <div className="card mb-1 flex-1 p-5">
                <h2 className="text-base font-semibold text-white">
                  {step.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-line bg-surface px-6 py-4 text-center">
          <p className="text-sm font-medium text-muted">
            MERCO ne garantit aucun revenu ni nombre de clients.
          </p>
        </div>
      </section>

      <section className="section-pad border-t border-line bg-surface/[0.35]">
        <div className="container-page">
          <h2 className="text-center text-xl font-bold text-white sm:text-2xl">
            Qui fait quoi&nbsp;?
          </h2>
          <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
            <article className="card p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-accent">
                Ce que MERCO gère
              </h3>
              <ul className="mt-4 space-y-2.5">
                {mercoHandles.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-slate-200"
                  >
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="card p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-300">
                Ce que vous gérez
              </h3>
              <ul className="mt-4 space-y-2.5">
                {youHandle.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-slate-200"
                  >
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/creer-saas#tarifs"
              className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-slate-950 transition-colors hover:bg-[#1fce5e]"
            >
              Voir les plans
            </a>
            <a
              href="/creer-saas/catalogue"
              className="inline-flex items-center justify-center rounded-full border border-line-soft px-7 py-3.5 text-base font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
            >
              Découvrir le catalogue
            </a>
          </div>

          <p className="mx-auto mt-6 max-w-md text-center text-sm text-muted">
            Une étape demande plus de détails&nbsp;?{" "}
            <a href="/creer-saas/faq" className="font-medium text-accent hover:underline">
              Consulter la FAQ
            </a>{" "}
            ou{" "}
            <a href="/creer-saas/demo" className="font-medium text-accent hover:underline">
              demander une démonstration
            </a>
            .
          </p>
        </div>
      </section>
    </PageShell>
  );
}