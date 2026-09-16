import Link from "next/link";
import type { CatalogCardModel } from "@/lib/catalog/types";
import { isCommerciallyAvailableView } from "@/lib/catalog/status";
import { IconLayers } from "@/components/icons";
import { ProductStatusBadge } from "./ProductStatusBadge";
import { ProductCta } from "./ProductCta";

const MULTI_TENANT_LABEL: Record<string, string | null> = {
  true: "Multi-tenant",
  "needs-audit": "Multi-tenant à auditer",
  false: null,
  unknown: null,
};

interface ProductCardProps {
  product: CatalogCardModel;
  location?: string;
}

export function ProductCard({ product, location = "catalog_grid" }: ProductCardProps) {
  const available = isCommerciallyAvailableView(product);
  const multiTenant = MULTI_TENANT_LABEL[product.multiTenantStatus] ?? null;

  return (
    <article className="card flex flex-col overflow-hidden">
      {product.thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.thumbnailUrl}
          alt={`Aperçu de ${product.name}`}
          loading="lazy"
          className="aspect-[16/9] w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center bg-surface-2/70">
          <IconLayers className="h-10 w-10 text-muted" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
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

        <h3 className="mt-3 text-base font-semibold text-white">{product.name}</h3>
        {product.author ? (
          <p className="mt-1 text-xs text-muted">par {product.author}</p>
        ) : null}
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
          {product.description}
        </p>

        <dl className="mt-3 space-y-1 text-xs text-muted">
          {product.regularPriceUsd !== null ? (
            <div>
              <dt className="inline text-slate-300">Prix source : </dt>
              <dd className="inline">{product.regularPriceUsd} $</dd>
            </div>
          ) : null}
          {product.salesCount !== null ? (
            <div>
              <dt className="inline text-slate-300">
                Ventes observées sur Envato Market :{" "}
              </dt>
              <dd className="inline">{product.salesCount}</dd>
            </div>
          ) : null}
          {product.rating !== null ? (
            <div>
              <dt className="inline text-slate-300">Note observée sur la source : </dt>
              <dd className="inline">{product.rating} / 5</dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-4 flex flex-1 flex-col justify-end gap-2">
          {available ? (
            <ProductCta
              productId={product.id}
              envatoItemId={product.envatoItemId}
              name={product.name}
              category={product.categoryKey}
              status={product.status}
              saasScore={product.saasScore}
              available
              location={`${location}_card`}
              variant="card"
            />
          ) : null}
          <Link
            href={`/creer-saas/catalogue/${product.slug}`}
            className={`inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
              available
                ? "border border-line-soft text-slate-100 hover:border-accent-soft hover:text-white"
                : "bg-accent text-slate-950 hover:bg-[#1fce5e]"
            }`}
          >
            Voir la fiche
          </Link>
        </div>
      </div>
    </article>
  );
}