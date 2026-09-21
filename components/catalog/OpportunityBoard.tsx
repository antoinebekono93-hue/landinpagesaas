"use client";

import { useMemo, useState } from "react";
import type { CatalogCardModel } from "@/lib/catalog/types";
import { ProductCard } from "./ProductCard";

export interface OpportunityCategoryOption {
  key: string;
  label: string;
}

interface OpportunityBoardProps {
  products: CatalogCardModel[];
  categories: OpportunityCategoryOption[];
}

type Stage = "research" | "audit" | "available";

const STAGES: {
  key: Stage;
  title: string;
  note: string;
  match: (product: CatalogCardModel) => boolean;
}[] = [
  {
    key: "research",
    title: "À l'étude",
    note: "Détectés sur Envato Market, en attente de sélection MERCO.",
    match: (product) =>
      product.status === "research" || product.status === "review",
  },
  {
    key: "audit",
    title: "Audit en cours",
    note: "Licence ou vérification technique en cours de validation.",
    match: (product) =>
      product.status === "technical_review" || product.status === "license_review",
  },
  {
    key: "available",
    title: "Disponible avec MERCO",
    note: "Licence et audit technique validés, prêt à lancer.",
    match: (product) => product.status === "active",
  },
];

export function OpportunityBoard({
  products,
  categories,
}: OpportunityBoardProps) {
  const [categoryKey, setCategoryKey] = useState<string>("all");

  const filtered = useMemo(() => {
    const resolved =
      categoryKey === "all"
        ? products
        : products.filter((product) => product.categoryKey === categoryKey);
    return [...resolved].sort((a, b) => b.saasScore - a.saasScore);
  }, [products, categoryKey]);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCategoryKey("all")}
          aria-pressed={categoryKey === "all"}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            categoryKey === "all"
              ? "border-accent/50 bg-accent/10 text-accent"
              : "border-line-soft text-muted hover:border-accent-soft hover:text-white"
          }`}
        >
          Toutes
        </button>
        {categories.map((category) => (
          <button
            key={category.key}
            type="button"
            onClick={() => setCategoryKey(category.key)}
            aria-pressed={categoryKey === category.key}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              categoryKey === category.key
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-line-soft text-muted hover:border-accent-soft hover:text-white"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {STAGES.map((stage) => {
          const items = filtered.filter(stage.match);
          return (
            <section
              key={stage.key}
              aria-labelledby={`stage-${stage.key}-title`}
              className="rounded-2xl border border-line-soft bg-surface-2/40 p-4"
            >
              <header className="flex items-center justify-between gap-3">
                <div>
                  <h2
                    id={`stage-${stage.key}-title`}
                    className="text-sm font-bold text-white"
                  >
                    {stage.title}
                  </h2>
                  <p className="mt-1 text-xs text-muted">{stage.note}</p>
                </div>
                <span className="rounded-full border border-line-soft bg-surface-2 px-2.5 py-1 text-xs font-semibold text-muted">
                  {items.length}
                </span>
              </header>

              {items.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {items.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      location="opportunity_board"
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-line-soft p-6 text-center text-sm text-muted">
                  Aucun candidat dans cette colonne.
                </div>
              )}
            </section>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-muted">
        Une opportunité passe à «&nbsp;Disponible avec MERCO&nbsp;» uniquement
        après validation manuelle de la licence et de l&apos;audit technique.
        Le score MERCO oriente l&apos;audit, il ne constitue jamais une preuve
        de licence.
      </p>
    </div>
  );
}