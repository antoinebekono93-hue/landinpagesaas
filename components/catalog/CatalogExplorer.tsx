"use client";

import type { JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  EVENT_CATALOG_FILTER,
  EVENT_CATALOG_SEARCH,
  EVENT_CATALOG_VIEW,
} from "@/lib/constants";
import type { CatalogCardModel } from "@/lib/catalog/types";
import { isCommerciallyAvailableView } from "@/lib/catalog/status";
import { trackEvent } from "@/lib/tracking";
import {
  IconCalendar,
  IconCart,
  IconChart,
  IconChat,
  IconGlobe,
  IconGraduation,
  IconSearch,
  IconTruck,
  IconUsers,
} from "@/components/icons";
import { ProductCard } from "./ProductCard";

const CATEGORY_ICONS: Record<string, (props: { className?: string }) => JSX.Element> = {
  "crm-sales": IconChart,
  booking: IconCalendar,
  ecommerce: IconCart,
  education: IconGraduation,
  "hr-management": IconUsers,
  "website-builder": IconGlobe,
  logistics: IconTruck,
  "whatsapp-crm": IconChat,
};

type TabKey = "research" | "active";

interface CatalogExplorerProps {
  products: CatalogCardModel[];
  categories: { key: string; label: string }[];
}

export function CatalogExplorer({ products, categories }: CatalogExplorerProps) {
  const [tab, setTab] = useState<TabKey>("research");
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    trackEvent(EVENT_CATALOG_VIEW, { location: "catalog_page" });
  }, []);

  const available = useMemo(
    () => products.filter((product) => isCommerciallyAvailableView(product)),
    [products]
  );
  const research = useMemo(
    () => products.filter((product) => !isCommerciallyAvailableView(product)),
    [products]
  );

  const activeList = tab === "active" ? available : research;

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return activeList.filter((product) => {
      if (category !== "all" && product.categoryKey !== category) return false;
      if (!normalized) return true;
      return [product.name, product.author ?? "", product.description, product.categoryLabel]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [activeList, category, query]);

  function handleSearch(value: string) {
    setQuery(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      if (value.trim()) {
        trackEvent(EVENT_CATALOG_SEARCH, {
          location: "catalog_page",
          search_term: value.trim().slice(0, 80),
        });
      }
    }, 500);
  }

  function handleCategory(next: string) {
    setCategory(next);
    trackEvent(EVENT_CATALOG_FILTER, {
      location: "catalog_page",
      filter: "category",
      value: next,
    });
  }

  function handleTab(next: TabKey) {
    setTab(next);
    trackEvent(EVENT_CATALOG_FILTER, {
      location: "catalog_page",
      filter: "availability",
      value: next,
    });
  }

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "research", label: "À l'étude", count: research.length },
    { key: "active", label: "Disponible avec MERCO", count: available.length },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Disponibilité">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={tab === item.key}
            onClick={() => handleTab(item.key)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              tab === item.key
                ? "border-accent-soft bg-accent/15 text-accent-soft"
                : "border-line-soft text-slate-300 hover:border-accent-soft hover:text-white"
            }`}
          >
            {item.label}
            <span className="ml-2 text-xs text-muted">{item.count}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full lg:max-w-sm">
          <span className="sr-only">Rechercher un produit</span>
          <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Rechercher un SaaS, un auteur, un usage…"
            className="w-full rounded-full border border-line-soft bg-surface-2/50 py-3 pl-11 pr-4 text-sm text-slate-100 outline-none transition-colors placeholder:text-muted focus:border-accent-soft"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleCategory("all")}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              category === "all"
                ? "border-accent-soft bg-accent/15 text-accent-soft"
                : "border-line-soft text-slate-300 hover:border-accent-soft hover:text-white"
            }`}
          >
            Toutes les catégories
          </button>
          {categories.map((item) => {
            const Icon = CATEGORY_ICONS[item.key] ?? IconGlobe;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleCategory(item.key)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  category === item.key
                    ? "border-accent-soft bg-accent/15 text-accent-soft"
                    : "border-line-soft text-slate-300 hover:border-accent-soft hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted">
        {filtered.length} produit{filtered.length > 1 ? "s" : ""} affiché
        {filtered.length > 1 ? "s" : ""}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="card mt-5 p-8 text-center text-sm text-muted">
          {tab === "active"
            ? "Aucun SaaS n'est encore activé. Les candidats sont en cours de vérification licence et technique."
            : "Aucun produit ne correspond à cette recherche pour le moment."}
        </div>
      )}
    </div>
  );
}