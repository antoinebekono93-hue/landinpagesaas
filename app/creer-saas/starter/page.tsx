import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { PlanCta } from "@/components/PlanCta";
import { IconCheck, IconRocket, IconUsers } from "@/components/icons";
import { PLAN_STARTER, WHATSAPP_LINK_STARTER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "MERCO Starter – Lancez 2 SaaS à 5 000 FCFA/mois",
  description:
    "Lancez jusqu'à 2 SaaS actifs pour 5 000 FCFA/mois. MERCO s'occupe de la mise en ligne, de l'hébergement selon le plan et de la maintenance technique de base.",
  alternates: {
    canonical: "/creer-saas/starter",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/creer-saas/starter",
    siteName: "MERCO",
    title: "MERCO Starter – Lancez 2 SaaS à 5 000 FCFA/mois",
    description:
      "Lancez jusqu'à 2 SaaS actifs pour 5 000 FCFA/mois. MERCO s'occupe de la mise en ligne et de l'hébergement selon votre plan.",
  },
};

const crumbs = [
  { label: "MERCO", href: "/" },
  { label: "Business SaaS", href: "/creer-saas" },
  { label: "Starter", current: true },
];

const features = [
  "jusqu'à 2 SaaS actifs",
  "hébergement selon les limites du plan",
  "SSL",
  "maintenance technique de base",
  "orientation MERCO",
  "support WhatsApp",
];

const audience = [
  "un entrepreneur qui débute",
  "un freelance",
  "une petite agence",
  "un porteur de projet",
  "une personne souhaitant tester 1 ou 2 activités SaaS",
];

const steps = [
  "Choisissez vos 2 SaaS",
  "MERCO prépare la mise en ligne",
  "Vous définissez votre offre",
  "Vous recherchez vos clients",
];

export default function StarterPage() {
  return (
    <PageShell crumbs={crumbs} location="breadcrumbs_starter">
      <section className="container-page py-10 sm:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Lancez vos 2 premiers SaaS
          </h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
            Idée simple, lancement simple. Choisissez 2 solutions et laissez
            MERCO gérer la partie technique prévue par votre abonnement.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-xl">
          <article className="card p-7 text-center sm:p-8">
            <span className="inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-accent">
              {PLAN_STARTER.name}
            </span>
            <p className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              5 000 FCFA
              <span className="text-lg font-semibold text-muted"> /mois</span>
            </p>
            <p className="mt-2 text-sm font-medium text-saas">
              Jusqu&apos;à 2 SaaS actifs
            </p>

            <ul className="mx-auto mt-6 max-w-sm space-y-2.5 text-left">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-slate-200"
                >
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {feature}
                </li>
              ))}
            </ul>

            <p className="mt-6 rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm font-medium text-slate-100">
              Pas besoin d&apos;être développeur.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <PlanCta
                plan="starter"
                label="Démarrer avec Starter"
                link={WHATSAPP_LINK_STARTER}
                location="starter_page"
              />
              <Link
                href="/creer-saas/catalogue"
                className="inline-flex items-center justify-center rounded-full border border-line-soft px-6 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
              >
                Voir le catalogue
              </Link>
            </div>
            <p className="mt-3 text-xs text-muted">
              Paiement mensuel selon les modalités MERCO
            </p>
          </article>
        </div>
      </section>

      <section className="section-pad border-t border-line">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-eyebrow">Cible</p>
            <h2 className="section-title">Pour qui est Starter&nbsp;?</h2>
          </div>
          <ul className="mx-auto mt-8 max-w-lg space-y-2.5">
            {audience.map((item) => (
              <li
                key={item}
                className="card flex items-start gap-3 px-5 py-3.5 text-sm text-slate-200"
              >
                <IconUsers className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-pad border-t border-line bg-surface/[0.35]">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-eyebrow">Fonctionnement</p>
            <h2 className="section-title">Comment ça fonctionne&nbsp;?</h2>
          </div>
          <ol className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <li key={step} className="card flex items-start gap-4 p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent">
                  {index + 1}
                </span>
                <p className="text-sm font-medium text-slate-100">{step}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PlanCta
              plan="starter"
              label="Démarrer avec Starter"
              link={WHATSAPP_LINK_STARTER}
              location="starter_page_steps"
            />
            <a
              href="/creer-saas/comment-ca-marche"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line-soft px-6 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
            >
              <IconRocket className="h-4 w-4 text-accent" />
              Comment ça marche
            </a>
          </div>

          <p className="mx-auto mt-6 max-w-md text-center text-sm text-muted">
            Vous préférez construire un portefeuille plus large&nbsp;?{" "}
            <a href="/creer-saas/pro" className="font-medium text-accent hover:underline">
              Découvrir l&apos;offre Pro
            </a>
            . Une question&nbsp;?{" "}
            <a href="/creer-saas/faq" className="font-medium text-accent hover:underline">
              Consulter la FAQ
            </a>
            .
          </p>
        </div>
      </section>
    </PageShell>
  );
}