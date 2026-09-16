"use client";

import { businessCatalogs } from "@/lib/content";
import { EVENT_CATALOG_CATEGORY } from "@/lib/constants";
import { getVisibleCatalog } from "@/lib/saas-catalog";
import { trackEvent } from "@/lib/tracking";
import {
  IconBuilding,
  IconCalendar,
  IconCart,
  IconChat,
  IconCode,
  IconGraduation,
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

const visibleProducts = getVisibleCatalog();

function handleCategoryClick(category: string) {
  trackEvent(EVENT_CATALOG_CATEGORY, { category, location: "catalog_category" });
}

export function CatalogSection() {
  return (
    <section id="catalogue" className="section-pad border-t border-line bg-surface/[0.35]">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Le catalogue</p>
          <h2 className="section-title">Quel business voulez-vous lancer ?</h2>
          <p className="mt-4 text-muted">
            Choisissez un domaine, puis sélectionnez les SaaS que vous voulez
            lancer.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {businessCatalogs.map((item) => (
            <article key={item.id} className="card flex flex-col p-5">
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
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
                    {use}
                  </li>
                ))}
              </ul>
              <a
                href="#saas-verifies"
                onClick={() => handleCategoryClick(item.title)}
                className="mt-4 inline-flex items-center justify-center rounded-full border border-line-soft bg-surface px-4 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
              >
                Voir les SaaS
              </a>
            </article>
          ))}
        </div>

        <div id="saas-verifies" className="mt-14 scroll-mt-24">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-xl font-bold text-white sm:text-2xl">
              Les SaaS vérifiés pour MERCO Business
            </h3>
            <p className="mt-2 text-sm text-muted">
              Un SaaS apparaît ici uniquement après vérification de son
              éligibilité et de sa licence.
            </p>
          </div>

          {visibleProducts.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => (
                <SaaSCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-dashed border-line-soft bg-surface p-8 text-center">
              <p className="text-sm font-medium text-white">
                Le catalogue vérifié est en cours de constitution.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Les SaaS sont ajoutés uniquement après vérification de
                l&apos;éligibilité Business et de la licence. En attendant,
                les domaines ci-dessus donnent une première idée des
                activités possibles.
              </p>
              <a
                href="#demo"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#1fce5e]"
              >
                Demander une démonstration
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}