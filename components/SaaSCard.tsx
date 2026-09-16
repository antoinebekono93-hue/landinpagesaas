"use client";

import type { SaasProduct } from "@/lib/saas-catalog";
import { EVENT_SAAS_SELECT, saasSelectLink } from "@/lib/constants";
import { trackEvent } from "@/lib/tracking";
import { IconLayers, IconShield } from "./icons";

interface SaaSCardProps {
  product: SaasProduct;
  planHint?: string;
}

export function SaaSCard({ product, planHint }: SaaSCardProps) {
  function handleSelect() {
    trackEvent(EVENT_SAAS_SELECT, {
      saas_id: product.id,
      category: product.category,
      plan_intent: planHint ?? "unknown",
      location: "catalog_card",
    });
    const href = saasSelectLink(product.name);
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <article className="card overflow-hidden">
      {product.screenshot ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.screenshot}
          alt={`Capture de ${product.name}`}
          className="aspect-[16/9] w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center bg-surface-2/70">
          <IconLayers className="h-10 w-10 text-muted" />
        </div>
      )}

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium">
          <span className="rounded-full border border-line-soft bg-surface-2 px-2.5 py-1 text-slate-200">
            {product.category}
          </span>
          {product.multiTenant ? (
            <span className="rounded-full border border-saas/30 bg-saas/10 px-2.5 py-1 text-saas">
              Multi-tenant
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-accent">
            <IconShield className="h-3 w-3" />
            Éligible MERCO Business
          </span>
        </div>

        <h3 className="mt-3 text-base font-semibold text-white">{product.name}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          {product.shortDescription}
        </p>

        {product.stack && product.stack.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.stack.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-line bg-surface-2 px-2 py-0.5 text-[11px] text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <p className="mt-3 text-xs leading-relaxed text-muted">
          <span className="font-medium text-slate-300">Cible :</span>{" "}
          {product.targetCustomers}
        </p>

        <button
          type="button"
          onClick={handleSelect}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#1fce5e]"
        >
          Choisir ce SaaS
        </button>
      </div>
    </article>
  );
}