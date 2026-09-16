"use client";

import { useState } from "react";
import Link from "next/link";
import { EVENT_NAVIGATION } from "@/lib/constants";
import { trackEvent } from "@/lib/tracking";
import { Logo } from "./Logo";

interface NavItem {
  key: string;
  label: string;
  href?: string;
  external?: boolean;
}

const desktopGroups: { key: string; label: string; items: NavItem[] }[] = [
  {
    key: "saas",
    label: "SaaS",
    items: [
      { key: "catalogue", label: "Voir le catalogue", href: "/creer-saas/catalogue" },
      { key: "entrepreneurs", label: "Pour entrepreneurs", href: "/creer-saas/entrepreneurs" },
    ],
  },
  {
    key: "tarifs",
    label: "Tarifs",
    items: [
      { key: "starter", label: "Offre Starter", href: "/creer-saas/starter" },
      { key: "pro", label: "Offre Pro", href: "/creer-saas/pro" },
    ],
  },
];

const desktopLinks: NavItem[] = [
  { key: "comment", label: "Comment ça marche", href: "/creer-saas/comment-ca-marche" },
  { key: "demo", label: "Démo", href: "/creer-saas/demo" },
  { key: "faq", label: "FAQ", href: "/creer-saas/faq" },
];

const mobileLinks: NavItem[] = [
  { key: "catalogue", label: "Catalogue", href: "/creer-saas/catalogue" },
  { key: "starter", label: "Starter", href: "/creer-saas/starter" },
  { key: "pro", label: "Pro", href: "/creer-saas/pro" },
  { key: "entrepreneurs", label: "Entrepreneurs", href: "/creer-saas/entrepreneurs" },
  { key: "comment", label: "Comment ça marche", href: "/creer-saas/comment-ca-marche" },
  { key: "demo", label: "Démo", href: "/creer-saas/demo" },
  { key: "faq", label: "FAQ", href: "/creer-saas/faq" },
  { key: "bibliotheque", label: "Bibliothèque MERCO", href: "/bibliotheque" },
];

function trackNav(destination: string, location: string) {
  trackEvent(EVENT_NAVIGATION, {
    destination,
    source_page: typeof window !== "undefined" ? window.location.pathname : "",
    location,
  });
}

export function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleNav(destination: string, location: string) {
    trackNav(destination, location);
    setOpenDropdown(null);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/creer-saas"
          onClick={() => handleNav("creer-saas", "logo")}
          className="flex items-center gap-2"
          aria-label="MERCO Business – accueil"
        >
          <Logo />
          <span className="rounded-full border border-line-soft bg-surface px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-saas">
            Business
          </span>
        </Link>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-5 lg:flex"
        >
          {desktopGroups.map((group) => (
            <div
              key={group.key}
              className="relative"
              onMouseEnter={() => setOpenDropdown(group.key)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                aria-expanded={openDropdown === group.key}
                onClick={() =>
                  setOpenDropdown(openDropdown === group.key ? null : group.key)
                }
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-white"
              >
                {group.label}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={`h-3.5 w-3.5 transition-transform ${
                    openDropdown === group.key ? "rotate-180" : ""
                  }`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {openDropdown === group.key ? (
                <div className="absolute left-0 top-full mt-1 w-60 rounded-xl border border-line bg-surface p-2 shadow-2xl shadow-black/40">
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item.key}>
                        <Link
                          href={item.href ?? "#"}
                          onClick={() => handleNav(item.href ?? "", "menu_desktop")}
                          className="block rounded-lg px-3 py-2.5 text-sm text-slate-200 transition-colors hover:bg-surface-2 hover:text-white"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ))}

          {desktopLinks.map((item) => (
            <Link
              key={item.key}
              href={item.href ?? "#"}
              onClick={() => handleNav(item.href ?? "", "nav_desktop")}
              className="text-sm font-medium text-muted transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/creer-saas#tarifs"
            onClick={() => handleNav("tarifs", "cta_desktop")}
            className="hidden items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#1fce5e] sm:inline-flex"
          >
            Choisir mon plan
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-slate-200 lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              {mobileOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h10" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-line bg-surface/95 backdrop-blur lg:hidden">
          <div className="container-page py-4">
            <ul className="space-y-1">
              {mobileLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href ?? "#"}
                    onClick={() => handleNav(item.href ?? "", "menu_mobile")}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-surface-2 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 border-t border-line pt-3">
              <Link
                href="/creer-saas#tarifs"
                onClick={() => handleNav("tarifs", "cta_mobile")}
                className="flex w-full items-center justify-center rounded-full bg-accent px-5 py-3.5 text-sm font-bold text-slate-950 transition-colors hover:bg-[#1fce5e]"
              >
                Lancer mes SaaS
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}