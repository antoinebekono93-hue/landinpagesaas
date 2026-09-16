import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { PlanCta } from "@/components/PlanCta";
import {
  IconBuilding,
  IconCheck,
  IconLayers,
} from "@/components/icons";
import { PRO } from "@/lib/business-pricing";
import {
  monthlyPrice,
  priceLabel,
  regularStartMonth,
  yearlySavings,
} from "@/lib/business-pricing";
import { WHATSAPP_LINK_PRO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "MERCO Pro – Jusqu'à 5 SaaS dès 18 $/mois",
  description:
    "Lancez jusqu'à 5 SaaS actifs à 18 $/mois pendant vos 12 premiers mois, puis 65 $/mois. Construisez un portefeuille de services numériques avec MERCO Business.",
  alternates: {
    canonical: "/creer-saas/pro",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/creer-saas/pro",
    siteName: "MERCO",
    title: "MERCO Pro – Jusqu'à 5 SaaS dès 18 $/mois",
    description:
      "Lancez jusqu'à 5 SaaS actifs à 18 $/mois pendant vos 12 premiers mois, puis 65 $/mois.",
  },
};

const crumbs = [
  { label: "MERCO", href: "/" },
  { label: "Business SaaS", href: "/creer-saas" },
  { label: "Pro", current: true },
];

const features = [
  "jusqu'à 5 SaaS actifs",
  "hébergement selon les limites du plan",
  "SSL",
  "maintenance technique de base",
  "orientation MERCO",
  "support WhatsApp",
  "possibilité de construire plusieurs offres SaaS",
];

const audience = [
  "une agence",
  "un entrepreneur multi-projets",
  "un freelance",
  "un consultant",
  "un revendeur de services numériques",
  "un porteur de plusieurs niches",
];

const multiSaasExamples = ["CRM", "Réservation", "E-commerce", "RH", "Logistique"];

export default function ProPage() {
  return (
    <PageShell crumbs={crumbs} location="breadcrumbs_pro">
      <section className="container-page py-10 sm:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Lancez jusqu&apos;à {PRO.saasLimit} SaaS pour{" "}
            {monthlyPrice(PRO.introductoryMonthlyPrice)}
          </h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
            Tarif de lancement pendant vos 12 premiers mois. Puis{" "}
            {monthlyPrice(PRO.regularMonthlyPrice)}. Plusieurs solutions
            actives, une seule souscription. MERCO gère la mise en ligne et
            l&apos;hébergement prévus par votre plan.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-xl">
          <article className="card relative overflow-hidden border-accent/40 p-7 text-center shadow-2xl shadow-accent/[0.06] sm:p-8">
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/10 blur-2xl"
            />
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-accent">
                {PRO.name}
              </span>
              <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-950">
                {PRO.badge}
              </span>
              <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-accent">
                {PRO.launchBadge}
              </span>
            </div>

            <p className="mt-5 text-sm font-semibold text-muted line-through">
              {monthlyPrice(PRO.regularMonthlyPrice)}
            </p>
            <p className="mt-1 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {PRO.introductoryMonthlyPrice} $
              <span className="text-lg font-semibold text-muted">/mois</span>
            </p>
            <p className="mt-1.5 text-sm font-semibold text-saas">
              pendant vos {PRO.introductoryMonths} premiers mois
            </p>
            <p className="mt-1 text-sm text-muted">
              {`À partir du ${regularStartMonth(PRO)}e mois : ${monthlyPrice(PRO.regularMonthlyPrice)}`}
            </p>
            <p className="mt-2 text-sm font-medium text-saas">
              Jusqu&apos;à {PRO.saasLimit} SaaS actifs
            </p>
            <p className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
              Économisez {priceLabel(yearlySavings(PRO))} la première année
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

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <PlanCta
                plan="pro"
                label={PRO.cta}
                link={WHATSAPP_LINK_PRO}
                location="pro_page"
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
            <h2 className="section-title">Pour qui est Pro&nbsp;?</h2>
          </div>
          <ul className="mx-auto mt-8 max-w-lg space-y-2.5">
            {audience.map((item) => (
              <li
                key={item}
                className="card flex items-start gap-3 px-5 py-3.5 text-sm text-slate-200"
              >
                <IconBuilding className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-pad border-t border-line bg-surface/[0.35]">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-eyebrow">Pourquoi plusieurs SaaS&nbsp;?</p>
            <h2 className="section-title">
              Plusieurs services, plusieurs types de clients
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Le client peut proposer plusieurs services à plusieurs types de
              clients, à partir d&apos;un même abonnement.
            </p>
          </div>

          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-3">
            {multiSaasExamples.map((example) => (
              <span
                key={example}
                className="rounded-full border border-line-soft bg-surface px-5 py-2.5 text-sm font-semibold text-slate-100"
              >
                {example}
              </span>
            ))}
          </div>

          <p className="mx-auto mt-8 flex max-w-xl items-start justify-center gap-2 rounded-2xl border border-line bg-surface px-6 py-4 text-center text-sm font-medium leading-relaxed text-muted">
            <IconLayers className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            MERCO ne garantit aucun revenu ni nombre de clients.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PlanCta
              plan="pro"
              label={PRO.cta}
              link={WHATSAPP_LINK_PRO}
              location="pro_page_exemples"
            />
            <a
              href="/creer-saas/comment-ca-marche"
              className="inline-flex items-center justify-center rounded-full border border-line-soft px-6 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
            >
              Comment ça marche
            </a>
          </div>

          <p className="mx-auto mt-6 max-w-md text-center text-sm text-muted">
            Envie de commencer plus petit&nbsp;?{" "}
            <a href="/creer-saas/starter" className="font-medium text-accent hover:underline">
              Découvrir l&apos;offre Starter
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