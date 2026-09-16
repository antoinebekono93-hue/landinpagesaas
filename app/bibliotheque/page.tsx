import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { LibraryCta } from "@/components/LibraryCta";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import {
  IconBox,
  IconBuilding,
  IconCode,
  IconDatabase,
} from "@/components/icons";
import {
  LIBRARY_PRICE,
  LIBRARY_PRICE_DETAIL,
  WHATSAPP_LINK_HOME,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Bibliothèque MERCO – Applications, scripts et ressources numériques",
  description:
    "Accès à vie à la bibliothèque MERCO : applications, scripts et ressources numériques pour développeurs, freelances et agences. Paiement unique de 10 000 FCFA.",
  alternates: {
    canonical: "/bibliotheque",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/bibliotheque",
    siteName: "MERCO",
    title: "Bibliothèque MERCO – Applications, scripts et ressources numériques",
    description:
      "Accès à vie à la bibliothèque MERCO : applications, scripts et ressources numériques. Paiement unique de 10 000 FCFA.",
  },
};

const crumbs = [
  { label: "MERCO", href: "/" },
  { label: "Bibliothèque", current: true },
];

const targetProfiles = [
  { label: "Développeurs", icon: <IconCode className="h-5 w-5" /> },
  { label: "Freelances", icon: <IconBox className="h-5 w-5" /> },
  { label: "Agences", icon: <IconBuilding className="h-5 w-5" /> },
  { label: "Profils techniques", icon: <IconDatabase className="h-5 w-5" /> },
];

export default function BibliothequePage() {
  return (
    <PageShell crumbs={crumbs} location="breadcrumbs_bibliotheque">
      <section className="container-page py-10 sm:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Vous préférez gérer vos projets vous-même&nbsp;?
          </h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
            L&apos;accès bibliothèque MERCO est une offre distincte, conçue en
            priorité pour les profils techniques qui installent et exploitent
            eux-mêmes les ressources.
          </p>
        </div>

        <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-3">
          {targetProfiles.map((profile) => (
            <li
              key={profile.label}
              className="flex items-center gap-2 rounded-full border border-line-soft bg-surface px-4 py-2.5 text-sm font-semibold text-slate-100"
            >
              <span className="text-accent">{profile.icon}</span>
              {profile.label}
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page pb-14">
        <div className="mx-auto max-w-xl">
          <article className="card border-line-soft p-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-saas/30 bg-saas/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-saas">
              <IconBox className="h-4 w-4" />
              Bibliothèque MERCO
            </span>
            <p className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {LIBRARY_PRICE}
            </p>
            <p className="mt-1.5 text-sm font-medium text-slate-300">
              {LIBRARY_PRICE_DETAIL} • paiement unique
            </p>

            <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-muted">
              <li>• Applications, scripts et ressources numériques</li>
              <li>• Accès organisé par catégories</li>
              <li>• Vous gérez l&apos;installation et l&apos;exploitation vous-même</li>
              <li>• Accès communiqué après paiement vérifié</li>
            </ul>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <LibraryCta />
              <WhatsAppButton
                location="bibliotheque_page"
                link={WHATSAPP_LINK_HOME}
                variant="outline"
              >
                Parler à MERCO
              </WhatsAppButton>
            </div>

            <p className="mt-5 text-xs leading-relaxed text-muted">
              Cette offre ne fait pas partie des abonnements Business Starter
              ou Pro. Aucun lien privé vers les ressources n&apos;est affiché
              publiquement&nbsp;: l&apos;accès est activé après validation du
              paiement.
            </p>
          </article>
        </div>
      </section>

      <section id="business" className="section-pad border-t border-line bg-surface/[0.35]">
        <div className="container-page text-center">
          <div className="mx-auto max-w-2xl">
            <p className="section-eyebrow">Vous cherchez une autre approche&nbsp;?</p>
            <h2 className="section-title">
              Vous préférez que MERCO gère la mise en ligne&nbsp;?
            </h2>
            <p className="mt-4 text-muted">
              Découvrez MERCO Business : un abonnement mensuel où MERCO met en
              ligne et maintient vos SaaS selon votre plan.
            </p>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/creer-saas"
              className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-slate-950 transition-colors hover:bg-[#1fce5e]"
            >
              Découvrir MERCO Business
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-line-soft px-7 py-3.5 text-base font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
            >
              Retour à l&apos;accueil
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}