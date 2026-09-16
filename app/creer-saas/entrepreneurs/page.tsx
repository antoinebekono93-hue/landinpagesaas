import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import {
  IconCalendar,
  IconCart,
  IconDatabase,
  IconUsers,
} from "@/components/icons";
import { WHATSAPP_LINK_HOME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Lancez un business SaaS sans être développeur – MERCO",
  description:
    "MERCO s'adresse aussi aux entrepreneurs non techniques : choisissez une solution existante, MERCO s'occupe de la partie technique prévue par votre plan, vous vous concentrez sur vos clients.",
  alternates: {
    canonical: "/creer-saas/entrepreneurs",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/creer-saas/entrepreneurs",
    siteName: "MERCO",
    title: "Lancez un business SaaS sans être développeur – MERCO",
    description:
      "Choisissez une solution existante, MERCO s'occupe de la partie technique prévue par votre plan, vous vous concentrez sur vos clients.",
  },
};

const crumbs = [
  { label: "MERCO", href: "/" },
  { label: "Business SaaS", href: "/creer-saas" },
  { label: "Entrepreneurs", current: true },
];

const journey = [
  {
    title: "Vous avez une idée mais pas d'équipe technique ?",
    text: "C'est justement pour cette situation que MERCO Business existe.",
  },
  {
    title: "Choisissez une solution existante",
    text: "Une solution est déjà opérationnelle dans le catalogue : il suffit de la sélectionner.",
  },
  {
    title: "MERCO s'occupe de la partie technique prévue par votre plan",
    text: "Mise en ligne, hébergement selon le plan, maintenance technique de base.",
  },
  {
    title: "Vous vous concentrez sur votre offre et vos clients",
    text: "Le produit existe. Votre travail, c'est l'offre, le prix et la vente.",
  },
];

const examples = [
  { label: "CRM pour PME", icon: <IconUsers className="h-6 w-6" /> },
  { label: "Réservation pour professionnels", icon: <IconCalendar className="h-6 w-6" /> },
  { label: "Plateforme e-commerce", icon: <IconCart className="h-6 w-6" /> },
  { label: "Logiciel de gestion", icon: <IconDatabase className="h-6 w-6" /> },
];

export default function EntrepreneursPage() {
  return (
    <PageShell crumbs={crumbs} location="breadcrumbs_entrepreneurs">
      <section className="container-page py-10 sm:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent">
            Pour les entrepreneurs
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Pas besoin d&apos;être développeur pour lancer votre SaaS
          </h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
            Vous avez une idée de service numérique mais pas d&apos;équipe
            technique&nbsp;? MERCO met à disposition des solutions prêtes à
            être lancées.
          </p>
        </div>

        <ol className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
          {journey.map((step, index) => (
            <li key={step.title} className="card p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent">
                {index + 1}
              </span>
              <h2 className="mt-4 text-base font-semibold text-white">
                {step.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-pad border-t border-line bg-surface/[0.35]">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-eyebrow">Exemples</p>
            <h2 className="section-title">
              Quel type de SaaS un entrepreneur peut-il lancer&nbsp;?
            </h2>
            <p className="mt-4 text-muted">
              Des cas génériques pour illustrer le type de services possibles.
            </p>
          </div>

          <ul className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
            {examples.map((example) => (
              <li key={example.label} className="card flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-saas/30 bg-saas/10 text-saas">
                  {example.icon}
                </div>
                <p className="text-sm font-semibold text-slate-100">
                  {example.label}
                </p>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-8 max-w-xl text-center text-sm leading-relaxed text-muted">
            Ces exemples n&apos;impliquent aucun revenu garanti. Les solutions
            disponibles dépendent du catalogue vérifié au moment de la
            souscription.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/creer-saas/catalogue"
              className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-slate-950 transition-colors hover:bg-[#1fce5e]"
            >
              Découvrir les SaaS disponibles
            </a>
            <WhatsAppButton
              location="entrepreneurs_page"
              link={WHATSAPP_LINK_HOME}
              variant="outline"
              size="lg"
            >
              Parler à MERCO
            </WhatsAppButton>
          </div>

          <p className="mx-auto mt-6 max-w-md text-center text-sm text-muted">
            Choisir le plan{" "}
            <a href="/creer-saas/starter" className="font-medium text-accent hover:underline">
              Starter
            </a>{" "}
            ou{" "}
            <a href="/creer-saas/pro" className="font-medium text-accent hover:underline">
              Pro
            </a>{" "}
            selon le nombre de services visés. Voir{" "}
            <a href="/creer-saas/comment-ca-marche" className="font-medium text-accent hover:underline">
              comment ça marche
            </a>
            .
          </p>
        </div>
      </section>
    </PageShell>
  );
}