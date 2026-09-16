import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { ProductStatusBadge } from "@/components/catalog/ProductStatusBadge";
import { ProductSourceLink } from "@/components/catalog/ProductSourceLink";
import { OfficialDemoCard } from "@/components/catalog/OfficialDemoCard";
import { PublicDemoCredentials } from "@/components/catalog/PublicDemoCredentials";
import { ProductCta } from "@/components/catalog/ProductCta";
import { ProductViewTracker } from "@/components/catalog/ProductViewTracker";
import { EnvatoAttribution } from "@/components/catalog/EnvatoAttribution";
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
      <div className="mt-2">{children}</div>
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  if (items.length === 0) return <p className="text-sm text-muted">—</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((tag) => (
        <span
          key={tag}
          className="rounded-md border border-line bg-surface-2 px-2 py-1 text-xs text-muted"
        >
          {tag}
        </span>
      ))}
    </div>
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
  if (!product) {
    return {
      title: "Produit introuvable – MERCO",
      robots: { index: false },
    };
  }
  const indexable = isCommerciallyAvailableView(product);
  return {
    title: `${product.name} – Fiche SaaS MERCO`,
    description: product.description.slice(0, 160),
    alternates: { canonical: `/creer-saas/catalogue/${product.slug}` },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: `/creer-saas/catalogue/${product.slug}`,
      siteName: "MERCO",
      title: `${product.name} – Fiche SaaS MERCO`,
      description: product.description.slice(0, 160),
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

  const crumbs = [
    { label: "MERCO", href: "/" },
    { label: "Business SaaS", href: "/creer-saas" },
    { label: "Catalogue", href: "/creer-saas/catalogue" },
    { label: product.name, current: true },
  ];

  const observedRows: { label: string; value: string | null }[] = [
    { label: "Prix source", value: formatUsd(product.regularPriceUsd) },
    {
      label: "Prix source étendu",
      value: formatUsd(product.extendedPriceUsd),
    },
    {
      label: "Ventes observées sur Envato Market",
      value: product.salesCount !== null ? String(product.salesCount) : null,
    },
    {
      label: "Note observée sur la source",
      value:
        product.rating !== null
          ? `${product.rating} / 5${product.ratingCount !== null ? ` (${product.ratingCount} avis)` : ""}`
          : null,
    },
    { label: "Publié le", value: formatDate(product.publishedAt) },
    { label: "Mis à jour sur la source", value: formatDate(product.updatedAtEnvato) },
  ];

  return (
    <PageShell crumbs={crumbs} location="breadcrumbs_product_page">
      <ProductViewTracker
        productId={product.id}
        envatoItemId={product.envatoItemId}
        category={product.categoryKey}
        status={product.status}
        saasScore={product.saasScore}
        location="product_page"
      />

      <section className="container-page py-10 sm:py-14">
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

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {product.name}
        </h1>
        {product.author ? (
          <p className="mt-2 text-sm text-muted">par {product.author}</p>
        ) : null}

        <p className="mt-4 max-w-3xl leading-relaxed text-slate-200">
          {product.description}
        </p>

        {available ? (
          <div className="mt-6 rounded-2xl border border-accent/40 bg-accent/10 px-4 py-4 text-sm leading-relaxed text-accent-soft">
            Ce SaaS est disponible avec MERCO Business (licence et vérification
            technique validées). Prêt à être vendu sur votre domaine, avec vos
            factures et votre marque.
          </div>
        ) : product.status === "source_unavailable" ? (
          <div className="mt-6 rounded-2xl border border-warn/40 bg-warn/10 px-4 py-4 text-sm leading-relaxed text-warn-soft">
            Données source en cours de mise à jour. Les informations affichées
            restent celles de la dernière synchronisation Envato.
          </div>
        ) : null}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
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
      </section>

      <section className="container-page pb-14">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <Section title="Informations observées sur la source">
              <dl className="space-y-2 text-sm">
                {observedRows
                  .filter((row) => row.value !== null)
                  .map((row) => (
                    <div key={row.label}>
                      <dt className="text-muted">{row.label}</dt>
                      <dd className="text-slate-100">{row.value}</dd>
                    </div>
                  ))}
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-muted">
                Ce prix correspond à la source officielle et ne constitue pas le
                tarif de l&apos;abonnement MERCO.
              </p>
            </Section>

            {product.targetCustomers.length > 0 ? (
              <Section title="Cibles recommandées">
                <TagList items={product.targetCustomers} />
              </Section>
            ) : null}

            {product.techStack.length > 0 ? (
              <Section title="Technologies observées">
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
          </div>

          <div className="space-y-5">
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

            {product.mercoScreenshots.length > 0 ? (
              <Section title="Démonstration MERCO">
                <div className="grid gap-3">
                  {product.mercoScreenshots.map((src) => (
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

            {product.mercoNotes ? (
              <Section title="Note MERCO">
                <p className="text-sm leading-relaxed text-slate-200">
                  {product.mercoNotes}
                </p>
              </Section>
            ) : null}
          </div>
        </div>

        <EnvatoAttribution className="mt-8 text-center" />

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/creer-saas/catalogue"
            className="inline-flex items-center justify-center rounded-full border border-line-soft px-6 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
          >
            Retour au catalogue
          </Link>
        </div>
      </section>
    </PageShell>
  );
}