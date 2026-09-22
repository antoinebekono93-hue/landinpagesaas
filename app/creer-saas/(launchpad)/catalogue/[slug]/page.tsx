import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductStatusBadge } from "@/components/catalog/ProductStatusBadge";
import { ProductSourceLink } from "@/components/catalog/ProductSourceLink";
import { OfficialDemoCard } from "@/components/catalog/OfficialDemoCard";
import { PublicDemoCredentials } from "@/components/catalog/PublicDemoCredentials";
import { ProductCta } from "@/components/catalog/ProductCta";
import { ProductViewTracker } from "@/components/catalog/ProductViewTracker";
import { EnvatoAttribution } from "@/components/catalog/EnvatoAttribution";
import { ScoreRing } from "@/components/catalog/ScoreRing";
import { MercoVerificationStatus } from "@/components/catalog/MercoVerificationStatus";
import { WhiteLabelCard } from "@/components/catalog/WhiteLabelCard";
import { FeaturesGrid } from "@/components/catalog/FeaturesGrid";
import { ConfidenceTag } from "@/components/catalog/ConfidenceTag";
import { SourceHistoryCard } from "@/components/catalog/SourceHistoryCard";
import { OpportunityBoardCta } from "@/components/catalog/OpportunityBoard";
import { ProductTabs, ProductTabContent } from "@/components/catalog/ProductTabs";
import { IconLayers } from "@/components/icons";
import { loadProductBySlug, getFallbackSlugs } from "@/lib/catalog/source";
import { isCommerciallyAvailableView } from "@/lib/catalog/status";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getFallbackSlugs().map((slug) => ({ slug }));
}

const MULTI_TENANT_LABEL: Record<string, string | null> = {
  true: "Multi-tenant",
  "needs-audit": "Multi-tenant à auditer",
  false: "Single-tenant",
  unknown: null,
};

function formatUsd(value: number | null): string | null {
  return value === null ? null : `${value} $`;
}

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-5">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-md border border-line bg-surface-2 px-2 py-1 text-xs text-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loaded = await loadProductBySlug(slug);
  const product = loaded?.product ?? null;

  if (!product) return { title: "Produit introuvable — MERCO" };

  const previewImage = product.mercoScreenshots[0] ?? product.thumbnailUrl ?? null;
  const categoryLabel = product.categoryLabel ?? "SaaS";

  return {
    title: `${product.name} – ${categoryLabel} | MERCO`,
    description: product.description?.slice(0, 155) ?? undefined,
    alternates: {
      canonical: `/creer-saas/catalogue/${product.slug}`,
    },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: `/creer-saas/catalogue/${product.slug}`,
      siteName: "MERCO",
      title: `${product.name} – ${categoryLabel} | MERCO`,
      description: product.description?.slice(0, 155) ?? undefined,
      images: previewImage ? [{ url: previewImage }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loaded = await loadProductBySlug(slug);
  const product = loaded?.product ?? null;
  if (!product) notFound();

  const available = isCommerciallyAvailableView(product);
  const multiTenant = MULTI_TENANT_LABEL[product.multiTenantStatus] ?? null;
  const heroImage = product.mercoScreenshots[0] ?? product.thumbnailUrl ?? null;
  const opportunityHref = `/creer-saas/opportunites?category=${encodeURIComponent(product.categoryKey)}`;

  return (
    <div className="w-full">
      <ProductViewTracker
        productId={product.id}
        envatoItemId={product.envatoItemId}
        category={product.categoryKey}
        status={product.status}
        saasScore={product.saasScore}
        location="product_page"
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* ─────────── Colonne principale ─────────── */}
        <div className="min-w-0 space-y-8">
          {/* Fil d'Ariane */}
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-xs">
            <Link href="/creer-saas/catalogue" className="text-muted transition-colors hover:text-white">
              Catalogue
            </Link>
            <span aria-hidden="true" className="text-muted">/</span>
            <span aria-current="page" className="truncate text-white">
              {product.name}
            </span>
          </nav>

          {/* ─────────── Héros ─────────── */}
          <section aria-labelledby="product-hero-title">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium">
              <ProductStatusBadge status={product.status} />
              <span className="rounded-full border border-line-soft bg-surface-2 px-2.5 py-1 text-slate-200">
                {product.categoryLabel}
              </span>
              {multiTenant ? (
                <span className="rounded-full border border-saas/30 bg-saas/10 px-2.5 py-1 text-saas">
                  {multiTenant}
                </span>
              ) : null}
            </div>

            <h1
              id="product-hero-title"
              className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              {product.name}
            </h1>
            {product.author ? (
              <p className="mt-2 text-sm text-muted">par {product.author}</p>
            ) : null}

            {heroImage ? (
              <div className="mt-6 overflow-hidden rounded-2xl border border-line-soft bg-surface-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImage}
                  alt={`Aperçu de ${product.name}`}
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>
            ) : (
              <div className="mt-6 flex aspect-[16/9] w-full items-center justify-center rounded-2xl border border-line-soft bg-surface-2/70">
                <IconLayers className="h-12 w-12 text-muted" />
              </div>
            )}

            {available ? (
              <p className="mt-6 rounded-2xl border border-accent/40 bg-accent/10 px-4 py-4 text-sm leading-relaxed text-accent-soft">
                Ce SaaS est disponible avec MERCO Business (licence et
                vérification technique validées). Prêt à être vendu sur votre
                domaine, avec vos factures et votre marque.
              </p>
            ) : product.status === "source_unavailable" ? (
              <p className="mt-6 rounded-2xl border border-warn/40 bg-warn/10 px-4 py-4 text-sm leading-relaxed text-warn-soft">
                Données source en cours de mise à jour. Les informations
                affichées restent celles de la dernière synchronisation Envato.
              </p>
            ) : null}
          </section>

          {/* ─────────── Onglets produit ─────────── */}
          <ProductTabs>
            <ProductTabContent label="Description">
              <div className="space-y-5" data-tab-panel="description">
                <Section title="Description">
                  <p className="leading-relaxed text-slate-200">
                    {product.description}
                  </p>
                  {product.tags.length > 0 ? (
                    <div className="mt-4">
                      <TagList items={product.tags} />
                    </div>
                  ) : null}
                </Section>

                {product.features.length > 0 ? (
                  <FeaturesGrid features={product.features} />
                ) : null}

                {product.targetCustomers.length > 0 ? (
                  <Section title="Cas d'utilisation">
                    <TagList items={product.targetCustomers} />
                  </Section>
                ) : null}

                {product.mercoScreenshots.length > 1 ? (
                  <Section title="Captures supplémentaires">
                    <div className="grid gap-3">
                      {product.mercoScreenshots.slice(1).map((src) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={src}
                          src={src}
                          alt={`Démonstration de ${product.name}`}
                          className="w-full rounded-xl border border-line object-cover"
                        />
                      ))}
                    </div>
                  </Section>
                ) : null}

                <OfficialDemoCard
                  productId={product.id}
                  envatoItemId={product.envatoItemId}
                  category={product.categoryKey}
                  productName={product.name}
                  previewUrl={product.previewUrl}
                  sourceUrl={product.productUrl}
                  location="product_page"
                />

                <PublicDemoCredentials
                  credentials={product.demoCredentials}
                  productId={product.id}
                  envatoItemId={product.envatoItemId}
                  category={product.categoryKey}
                  location="product_page"
                />
              </div>
            </ProductTabContent>

            <ProductTabContent label="Opportunité">
              <div className="space-y-5" data-tab-panel="opportunite">
                <Section title="À qui vendre ?">
                  {product.targetCustomers.length > 0 ? (
                    <TagList items={product.targetCustomers} />
                  ) : (
                    <p className="text-sm leading-relaxed text-muted">
                      Les cibles précises dépendent de l&apos;analyse. Voici une
                      orientation générale : ce type de solution intéresse des
                      équipes qui cherchent à démarrer un service sans écrire de
                      code, ou des agences qui livrent des produits SaaS en
                      marque blanche.
                    </p>
                  )}
                </Section>

                <Section title="Ce que MERCO peut proposer">
                  <p className="text-sm leading-relaxed text-slate-200">
                    Avec un abonnement MERCO Business, cette solution peut être
                    activée sur votre domaine, avec vos factures et votre
                    marque. Vous facturez ensuite vos propres clients. Les idées
                    ci-dessous sont des exemples de scénarios, pas des résultats
                    garantis.
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm text-slate-200">
                    {product.features.length > 0 ? (
                      product.features.slice(0, 6).map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {feature}
                        </li>
                      ))
                    ) : (
                      <li className="flex items-start gap-2 text-muted">
                        Les fonctionnalités observées apparaîtront ici dès que
                        l&apos;analyse sera complète.
                      </li>
                    )}
                  </ul>
                </Section>

                <Section title="Comment le commercialiser ?">
                  <ul className="space-y-3 text-sm text-slate-200">
                    <li>
                      <span className="font-semibold text-white">
                        Service packagé&nbsp;
                      </span>
                      — proposer une offre prête à l&apos;emploi (installation,
                      configuration, formation) avec un tarif d&apos;entrée clair.
                    </li>
                    <li>
                      <span className="font-semibold text-white">
                        Abonnement récurrent&nbsp;
                      </span>
                      — facturer un mensuel pour l&apos;hébergement, les mises à
                      jour et le support.
                    </li>
                    <li>
                      <span className="font-semibold text-white">
                        Personnalisation&nbsp;
                      </span>
                      — prévoir un tarif séparé pour adapter l&apos;outil aux
                      besoins d&apos;un client précis.
                    </li>
                  </ul>
                </Section>

                <Section title="Modèles de facturation possibles">
                  <TagList items={["Abonnement mensuel", "Paiement unique + support", "Forfait projet + maintenance"]} />
                  <p className="mt-3 text-xs text-muted">
                    Exemples de scénarios à étudier selon le marché visé. MERCO
                    ne garantit aucun niveau de revenus.
                  </p>
                </Section>

                {product.techStack.length > 0 ||
                product.dependencies.length > 0 ||
                product.externalCosts.length > 0 ? (
                  <Section title="Complexité, APIs et exploitation">
                    {product.techStack.length > 0 ? (
                      <div className="mb-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                          Technologies observées
                        </p>
                        <TagList items={product.techStack} />
                      </div>
                    ) : null}
                    {product.dependencies.length > 0 ? (
                      <div className="mb-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                          Dépendances
                        </p>
                        <TagList items={product.dependencies} />
                      </div>
                    ) : null}
                    {product.externalCosts.length > 0 ? (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                          Coûts externes possibles
                        </p>
                        <TagList items={product.externalCosts} />
                      </div>
                    ) : null}
                  </Section>
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent-soft/40 bg-accent/10 px-5 py-4">
                  <p className="text-sm leading-relaxed text-slate-200">
                    Suivez cette opportunité dans le pipeline MERCO.
                  </p>
                  <OpportunityBoardCta
                    label="Voir dans les opportunités"
                    href={opportunityHref}
                  />
                </div>
              </div>
            </ProductTabContent>

            <ProductTabContent label="Avis">
              <div className="space-y-5" data-tab-panel="avis">
                <Section title="Avis de la source">
                  {product.rating !== null || product.salesCount !== null ? (
                    <dl className="grid gap-3 sm:grid-cols-2">
                      {product.rating !== null ? (
                        <div className="rounded-xl border border-line-soft bg-surface-2/60 p-4 text-center">
                          <dd className="text-2xl font-bold text-white">
                            {product.rating}
                            <span className="text-sm font-normal text-muted"> / 5</span>
                          </dd>
                          <dt className="mt-1 text-xs text-muted">
                            {product.ratingCount !== null
                              ? `${product.ratingCount} avis sur la source`
                              : "Note de la communauté"}
                          </dt>
                        </div>
                      ) : null}
                      {product.salesCount !== null ? (
                        <div className="rounded-xl border border-line-soft bg-surface-2/60 p-4 text-center">
                          <dd className="text-2xl font-bold text-white">
                            {product.salesCount}
                          </dd>
                          <dt className="mt-1 text-xs text-muted">
                            Ventes observées sur la source
                          </dt>
                        </div>
                      ) : null}
                    </dl>
                  ) : (
                    <p className="text-sm leading-relaxed text-muted">
                      Aucune donnée d&apos;évaluation disponible sur la source
                      pour le moment.
                    </p>
                  )}
                </Section>

                <Section title="Avis MERCO">
                  <p className="text-sm leading-relaxed text-muted">
                    Aucun avis MERCO vérifié pour le moment.
                  </p>
                </Section>
              </div>
            </ProductTabContent>

            <ProductTabContent label="Analyse MERCO" advanced>
              <div className="space-y-5" data-tab-panel="analyse-merco">
                <MercoVerificationStatus
                  product={{
                    saasCandidate: product.saasCandidate,
                    licenseVerified: product.licenseVerified,
                    technicallyVerified: product.technicallyVerified,
                    commerciallyAvailable: product.commerciallyAvailable,
                  }}
                />
                <WhiteLabelCard whiteLabelStatus={product.whiteLabelStatus} />
              </div>
            </ProductTabContent>

            <ProductTabContent label="Technique" advanced>
              <div className="space-y-5" data-tab-panel="technique">
                {product.techStack.length > 0 ? (
                  <Section title="Technologies observées">
                    <ConfidenceTag level="source" className="mb-2" />
                    <TagList items={product.techStack} />
                  </Section>
                ) : null}

                {product.dependencies.length > 0 ? (
                  <Section title="Dépendances">
                    <TagList items={product.dependencies} />
                  </Section>
                ) : null}

                {product.externalCosts.length > 0 ? (
                  <Section title="Coûts externes possibles">
                    <TagList items={product.externalCosts} />
                    <p className="mt-3 text-xs text-muted">
                      Codes et dépendances à prévoir avant l&apos;activation
                      commerciale.
                    </p>
                  </Section>
                ) : null}

                {multiTenant ? (
                  <Section title="Architecture">
                    <TagList items={[multiTenant]} />
                  </Section>
                ) : null}
              </div>
            </ProductTabContent>

            <ProductTabContent label="Historique" advanced>
              <div className="space-y-5" data-tab-panel="historique">
                <Section title="Données de la source">
                  <SourceHistoryCard
                    rating={product.rating}
                    ratingCount={product.ratingCount}
                    salesCount={product.salesCount}
                    regularPriceUsd={product.regularPriceUsd}
                    extendedPriceUsd={product.extendedPriceUsd}
                    updatedAtEnvato={product.updatedAtEnvato}
                    sourceVerified={product.sourceVerified}
                    publishedAt={product.publishedAt}
                    hasPreview={product.previewUrl !== null}
                  />
                </Section>

                <Section title="Historique d'audit MERCO">
                  <p className="text-sm leading-relaxed text-muted">
                    Aucun snapshot d&apos;évaluation n&apos;est encore disponible
                    pour ce produit. Les évolutions de l&apos;audit apparaîtront
                    ici au fil des vérifications.
                  </p>
                </Section>
              </div>
            </ProductTabContent>
          </ProductTabs>

          <EnvatoAttribution className="text-center" />

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/creer-saas/catalogue"
              className="inline-flex items-center justify-center rounded-full border border-line-soft px-6 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
            >
              Retour au catalogue
            </Link>
          </div>
        </div>

        {/* ─────────── Panneau latéral sticky ─────────── */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="card p-5">
            <ScoreRing score={product.saasScore} />

            <dl className="mt-5 space-y-2 border-t border-line-soft pt-4 text-sm">
              {[
                { label: "Prix source", value: formatUsd(product.regularPriceUsd) },
                {
                  label: "Ventes observées",
                  value:
                    product.salesCount !== null
                      ? String(product.salesCount)
                      : null,
                },
                {
                  label: "Note source",
                  value:
                    product.rating !== null
                      ? `${product.rating} / 5`
                      : null,
                },
                {
                  label: "Mis à jour",
                  value: formatDate(product.updatedAtEnvato),
                },
              ]
                .filter((row) => row.value !== null)
                .map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-3">
                    <dt className="text-muted">{row.label}</dt>
                    <dd className="font-medium text-slate-100">{row.value}</dd>
                  </div>
                ))}
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Indicateur interne de priorité basé sur les caractéristiques
              observées dans la source et les données du catalogue.
              Ce score ne garantit ni qualité commerciale ni rentabilité.
            </p>

            <div className="mt-5 space-y-3">
              <ProductCta
                productId={product.id}
                envatoItemId={product.envatoItemId}
                name={product.name}
                category={product.categoryKey}
                status={product.status}
                saasScore={product.saasScore}
                available={available}
                location="product_page_cta"
              />
              <ProductSourceLink
                url={product.productUrl}
                productId={product.id}
                envatoItemId={product.envatoItemId}
                category={product.categoryKey}
                location="product_page"
                label="Ouvrir la source officielle"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}