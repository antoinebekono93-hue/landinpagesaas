import Link from "next/link";
import type { HTMLAttributes } from "react";

const tabs = [
  { label: "Catalogue", href: "/creer-saas/launchpad/catalogue" },
  { label: "Applications", href: "/creer-saas/mes-applications" },
  { label: "Ressources", href: "/bibliotheque" },
  { label: "Accueil", href: "/" },
];

export function LaunchpadMobileNav({
  className = "",
  ...rest
}: HTMLAttributes<HTMLElement>) {
  return (
    <nav
      aria-label="Navigation mobile"
      className={`fixed inset-x-0 bottom-0 z-20 flex h-14 items-stretch border-t border-line-soft bg-surface-2/95 backdrop-blur lg:hidden ${className}`}
      {...rest}
    >
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] text-muted transition-colors hover:text-white"
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}