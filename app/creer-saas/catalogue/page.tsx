import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { CatalogContent } from "@/components/CatalogContent";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { businessCatalogs } from "@/lib/content";
import { WHATSAPP_LINK_HOME } from "@/lib/constants";
import { getVisibleCatalog } from "@/lib/saas-catalog";

export const metadata: Metadata = {
  title: "Catalogue SaaS MERCO – Solutions prêtes à lancer",
  description:
    "Découvrez les solutions SaaS disponibles avec MERCO Business. CRM, e-commerce, RH, réservation, logistique et autres catégories.",
  alternates: {
    canonical: "/creer-saas/catalogue",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/creer-saas/catalogue",
    siteName: "MERCO",
    title: "Catalogue SaaS MERCO – Solutions prêtes à lancer",
    description:
      "Découvrez les solutions SaaS disponibles avec MERCO Business. CRM, e-commerce, RH, réservation, logistique et autres catégories.",
  },
};

const crumbs = [
  { label: "MERCO", href: "/" },
  { label: "Business SaaS", href: "/creer-saas" },
  { label: "Catalogue", current: true },
];

export default function CataloguePage() {
  return (
    <PageShell crumbs={crumbs} location="breadcrumbs_catalogue">
      <section className="container-page py-10 text-center sm:py-14">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Quel SaaS voulez-vous lancer&nbsp;?
        </h1>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted">
          Explorez les catégories MERCO et choisissez les solutions qui
          correspondent à votre futur business.
        </p>
      </section>

      <section className="container-page pb-14">
        <CatalogContent
          products={getVisibleCatalog()}
          categories={businessCatalogs}
        />
      </section>

      <section className="border-t border-line">
        <div className="container-page py-14 text-center">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Vous ne trouvez pas la catégorie idéale&nbsp;?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Parlez-nous de votre projet sur WhatsApp. MERCO vous oriente vers
            les solutions adaptées ou vous propose un rendez-vous de
            démonstration.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <WhatsAppButton
              location="catalogue_page_cta"
              link={WHATSAPP_LINK_HOME}
            >
              Parler à MERCO
            </WhatsAppButton>
            <a
              href="/creer-saas/demo"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line-soft px-6 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
            >
              Voir la démo
            </a>
          </div>
          <p className="mx-auto mt-5 max-w-md text-sm text-muted">
            Un SaaS vous intéresse&nbsp;? Choisissez le plan{" "}
            <a href="/creer-saas/starter" className="font-medium text-accent hover:underline">
              Starter
            </a>{" "}
            ou{" "}
            <a href="/creer-saas/pro" className="font-medium text-accent hover:underline">
              Pro
            </a>{" "}
            directement.
          </p>
        </div>
      </section>
    </PageShell>
  );
}