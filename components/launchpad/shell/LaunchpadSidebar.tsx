import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

interface NavItem { label: string; href: string }

interface SidebarSection {
  title: string;
  items: NavItem[];
}

const sections: SidebarSection[] = [
  {
    title: "Launchpad",
    items: [
      { label: "Decouvrir", href: "/creer-saas/launchpad/decouvrir" },
      { label: "Catalogue", href: "/creer-saas/launchpad/catalogue" },
      { label: "Opportunites", href: "/creer-saas/launchpad/opportunites" },
      { label: "Enregistres", href: "/creer-saas/launchpad/enregistres" },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "Mes applications", href: "/creer-saas/mes-applications" },
      { label: "Deploiements", href: "/creer-saas/launchpad/deploiements" },
    ],
  },
  {
    title: "Ressources",
    items: [
      { label: "Bibliotheque", href: "/bibliotheque" },
      { label: "Retour", href: "/" },
    ],
  },
];

export function LaunchpadSidebar({
  className = "",
  ...rest
}: AnchorHTMLAttributes<HTMLElement>) {
  return (
    <nav aria-label="Launchpad" className={`space-y-0.5 ${className}`} {...rest}>
      {sections.map((section) => (
        <div key={section.title}>
          <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
            {section.title}
          </p>
          {section.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-white",

            >
              {item.label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}

