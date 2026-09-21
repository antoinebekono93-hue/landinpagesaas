import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";

interface Crumb {
  label: string;
  href?: string;
}

interface ShellProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  crumbs?: Crumb[];
  children: ReactNode;
}

const groups = [
  {
    title: "Launchpad",
    items: [
      { label: "Catalogue", href: "/creer-saas/catalogue" },
      { label: "Opportunites", href: "/creer-saas/opportunites" },
      { label: "Enregistres", href: "/creer-saas/enregistres" },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "Mes applications", href: "/creer-saas/mes-applications" },
      { label: "Deploiements", href: "/creer-saas/deploiements" },
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

export function LaunchpadShell({
  title,
  crumbs = [],
  className = "",
  children,
  ...rest
}: ShellProps) {
  const trail: Crumb[] = [
    { label: "MERCO", href: "/" },
    { label: "Business", href: "/creer-saas" },
    ...crumbs,
  ];
  return (
    <div className={`flex min-h-screen bg-surface text-white ${className}`} {...rest}>
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line-soft bg-surface-2/40 lg:flex">
        <div className="flex h-14 items-center gap-2 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-coral font-black text-slate-950">M</span>
            <span className="text-sm font-bold tracking-tight text-white">MERCO Launchpad</span>
          </Link>
        </div>
        <nav aria-label="Launchpad" className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="px-3 pb-2 text-xs font-medium uppercase tracking-widest text-muted">
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-line-soft px-4">
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-xs">
            {trail.map((crumb, i) => (
              <span key={i} className="flex min-w-0 items-center gap-1.5">
                {i > 0 ? <span aria-hidden="true" className="text-muted">/</span> : null}
                {crumb.href ? (
                  <Link href={crumb.href} className="truncate text-muted hover:text-white">{crumb.label}</Link>
                ) : (
                  <span aria-current="page" className="truncate text-white">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="sr-only">{title}</h1>
        </header>
        <main className="flex-1 grow p-6">{children}</main>
      </div>
    </div>
  );
}
