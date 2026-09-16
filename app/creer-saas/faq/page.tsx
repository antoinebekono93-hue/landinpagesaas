import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { FAQ } from "@/components/FAQ";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { WHATSAPP_LINK_HOME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "FAQ MERCO Business – SaaS, hébergement, licences et support",
  description:
    "Réponses aux questions les plus fréquentes sur MERCO Business : SaaS actifs, hébergement, licences, API externes, paiement, démonstration et différence entre les plans.",
  alternates: {
    canonical: "/creer-saas/faq",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/creer-saas/faq",
    siteName: "MERCO",
    title: "FAQ MERCO Business – SaaS, hébergement, licences et support",
    description:
      "Réponses aux questions les plus fréquentes sur MERCO Business : SaaS actifs, hébergement, licences, API externes, paiement et plans.",
  },
};

const crumbs = [
  { label: "MERCO", href: "/" },
  { label: "Business SaaS", href: "/creer-saas" },
  { label: "FAQ", current: true },
];

export default function FaqPage() {
  return (
    <PageShell crumbs={crumbs} location="breadcrumbs_faq">
      <section className="container-page py-10 sm:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Questions fréquentes
          </h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
            Tout ce qu&apos;il faut savoir avant de lancer votre business SaaS
            avec MERCO.
          </p>
        </div>

        <div className="mt-10">
          <FAQ />
        </div>

        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-line bg-surface px-6 py-6 text-center">
          <p className="text-sm font-medium text-slate-100">
            Une question n&apos;est pas listée&nbsp;?
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/creer-saas#tarifs"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#1fce5e]"
            >
              Voir les plans
            </a>
            <a
              href="/creer-saas/starter"
              className="inline-flex items-center justify-center rounded-full border border-line-soft px-6 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
            >
              Offre Starter
            </a>
            <a
              href="/creer-saas/pro"
              className="inline-flex items-center justify-center rounded-full border border-line-soft px-6 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
            >
              Offre Pro
            </a>
          </div>
          <div className="mt-5">
            <WhatsAppButton
              location="faq_page"
              link={WHATSAPP_LINK_HOME}
              variant="outline"
            >
              Parler à MERCO sur WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </section>
    </PageShell>
  );
}