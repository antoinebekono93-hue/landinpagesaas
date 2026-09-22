import type { Metadata } from "next";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { WHATSAPP_LINK_HOME } from "@/lib/constants";
import { EnvatoAttribution } from "@/components/catalog/EnvatoAttribution";
import { CatalogExplorer } from "@/components/catalog/CatalogExplorer";
import {
  getCatalogCategories,
  loadCatalog,
  toCardModel,
} from "@/lib/catalog/source";
import { isEnvatoDataFresh, lastSyncedLabel } from "@/lib/catalog/freshness";

export const dynamic = "force-dynamic";

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

const EXCLUDED_STATUSES = ["rejected", "archived"];

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { products, mode, lastSyncedAt } = await loadCatalog();
  const cards = products
    .filter((product) => !EXCLUDED_STATUSES.includes(product.status))
    .map(toCardModel);
  const categories = getCatalogCategories();
  const fresh = mode === "nhost" && isEnvatoDataFresh(lastSyncedAt);

  return (
    <div className="w-full">
      <section className="pb-4">
        <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          Explorez les logiciels
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
          Découvrez les applications étudiées par MERCO et trouvez celle à
          transformer en activité SaaS.
        </p>
      </section>

      {mode === "nhost" && !fresh ? (
        <p className="mb-4 max-w-2xl rounded-xl border border-warn/40 bg-warn/10 px-3 py-2.5 text-xs leading-relaxed text-warn-soft">
          Données source en cours de mise à jour. Les informations affichées
          restent celles de la dernière synchronisation Envato.
        </p>
      ) : null}

      <section aria-label="Explorateur de catalogue">
        <CatalogExplorer products={cards} categories={categories} initialQuery={q ?? ""} />
        {lastSyncedAt ? (
          <p className="mt-6 text-center text-xs text-muted">
            {lastSyncedLabel(lastSyncedAt)}
          </p>
        ) : null}
        <EnvatoAttribution className="mx-auto mt-4 max-w-2xl text-center" />
      </section>

      <section className="border-t border-line pt-8">
        <div className="text-center">
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
    </div>
  );
}