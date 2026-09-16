"use client";

import Link from "next/link";
import { EVENT_NAVIGATION } from "@/lib/constants";
import { trackEvent } from "@/lib/tracking";

export interface CrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: CrumbItem[];
  location: string;
}

function trackNav(destination: string, location: string) {
  trackEvent(EVENT_NAVIGATION, {
    destination,
    source_page: typeof window !== "undefined" ? window.location.pathname : "",
    location,
  });
}

export function Breadcrumbs({ items, location }: BreadcrumbsProps) {
  return (
    <nav aria-label="Fil d'ariane" className="container-page pt-6">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden="true" className="text-muted/50">
                  ›
                </span>
              ) : null}
              {item.href && !item.current ? (
                <Link
                  href={item.href}
                  onClick={() => trackNav(item.href ?? "", location)}
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast && item.current ? "page" : undefined}
                  className={item.current ? "text-slate-200" : ""}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}