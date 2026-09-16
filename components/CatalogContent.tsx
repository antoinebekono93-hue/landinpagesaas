"use client";

import { useMemo, useState } from "react";
import type { BusinessCategory } from "@/lib/content";
import type { SaasProduct } from "@/lib/saas-catalog";
import { EVENT_CATALOG_CATEGORY } from "@/lib/constants";
import { trackEvent } from "@/lib/tracking";
import {
  IconBuilding,
  IconCalendar,
  IconCart,
  IconChat,
  IconCode,
  IconGraduation,
  IconSearch,
  IconTruck,
  IconUsers,
} from "./icons";
import { SaaSCard } from "./SaaSCard";

const iconMap: Record<string, React.ReactNode> = {
  users: <IconUsers className="h-6 w-6" />,
  calendar: <IconCalendar className="h-6 w-6" />,
  cart: <IconCart className="h-6 w-6" />,
  graduation: <IconGraduation className="h-6 w-6" />,
  building: <IconBuilding className="h-6 w-6" />,
  code: <IconCode className="h-6 w-6" />,
  truck: <IconTruck className="h-6 w-6" />,
  chat: <IconChat className="h-6 w-6" />,
};

interface CatalogContentProps {
  products: SaasProduct[];
  categories: BusinessCategory[];
}

export function CatalogContent({ products, categories }: CatalogContentProps) {
  const [selected, setSelected] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      const inCategory =
        selected === "all" || product.category === selected;
      if (!inCategory) return false;
      if (!q) return true;
      return [
        product.name,
        product.category,
        product.shortDescription,
        product.targetCustomers,
        ...(product.stack ?? []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [products, selected, query]);

  function selectCategory(category: string) {
    setSelected(category);
    trackEvent(EVENT_CATALOG_CATEGORY, {
      category,
      location: "catalogue_page",
    });
    document
      .getElementById("catalogue-produits")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div>
      <div className="mx-auto max-w-2xl">
        <label htmlFor="catalogue-search" className="relative block">
          <span className="sr-only">Rechercher un SaaS</span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          >
            <IconSearch className="h-5 w-5" />
          </span>
          <input
            id="catalogue-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un SaaS (CRM, réservation, e-commerce…)"
            className="w-full rounded-2xl border border-line-soft bg-surface py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-muted focus:border-accent-soft focus:outline-none"
          />
        </label>
      </div>

      <div
        className="mt-6 flex flex-wrap items-center justify-center gap-2"
        role="group"
        aria-label="Filtrer par catégorie"
      >
        <button
          type="button"
          onClick={() => setSelected("all")}
          aria-pressed={selected === "all"}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
            selected === "all"
              ? "border-accent bg-accent text-slate-950"
              : "border-line-soft bg-surface text-slate-200 hover:border-accent-soft"
          }`}
        >
          Toutes
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => selectCategory(category.title)}
            aria-pressed={selected === category.title}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              selected === category.title
                ? "border-accent bg-accent text-slate-950"
                : "border-line-soft bg-surface text-slate-200 hover:border-accent-soft"
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      <div id="catalogue-produits" className="mt-10 scroll-mt-24">
        {filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <SaaSCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-line-soft bg-surface p-8 text-center">
            <p className="text-sm font-medium text-white">
              Solutions en cours de sélection.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {selected === "all" && !query
                ? "Les SaaS sont ajoutés uniquement après vérification de l'éligibilité Business et de la licence. Aucun faux produit ne sera affiché."
                : "Aucun SaaS ne correspond à votre recherche pour le moment. Les produits vérifiés seront ajoutés au fil de la sélection."}
            </p>
          </div>
        )}
      </div>

      <div className="mt-14">
        <h2 className="text-center text-xl font-bold text-white sm:text-2xl">
          Explorer par domaine
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((item) => {
            const count = products.filter(
              (product) => product.category === item.title
            ).length;
            return (
              <article
                key={item.id}
                className="card flex flex-col p-5"
                id={`categorie-${item.id}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-saas/30 bg-saas/10 text-saas">
                  {iconMap[item.icon]}
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
                <ul className="mt-3 space-y-1 text-xs text-muted">
                  {item.useCases.map((use) => (
                    <li key={use} className="flex items-center gap-1.5">
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 rounded-full bg-accent"
                      />
                      {use}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-1">
                  {count > 0 ? (
                    <button
                      type="button"
                      onClick={() => selectCategory(item.title)}
                      className="inline-flex w-full items-center justify-center rounded-full border border-line-soft bg-surface px-4 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
                    >
                      Voir les SaaS
                    </button>
                  ) : (
                    <p className="text-center text-xs font-medium text-muted">
                      Solutions en cours de sélection.
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}