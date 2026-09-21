import Link from "next/link";
import type { HTMLAttributes } from "react";

interface Crumb { label: string; href?: string }

interface TopbarProps extends HTMLAttributes<HTMLElement> {
  title: string;
  crumbs?: Crumb[];
}

export function LaunchpadTopbar({
  title,
  crumbs = [],
  className = "",
  ...rest
}: TopbarProps) {
  const trail: Crumb[] = [
    { label: "MERCO", href: "/" },
    { label: "Business", href: "/creer-saas" },
    ...crumbs,
  ];
  return (
    <header className={`flex h-14 shrink-0 items-center gap-4 border-b border-line-soft px-4 ${className}`} {...rest}>
      <h1 className="text-sm font-bold tracking-tight text-white">{title}</h1>
      <nav aria-label="Fil d ARIANE" className="flex min-w-0 items-center gap-1.5 text-xs">
        {trail.map((crumb, i) => (
          <span key={i} className="flex min-w-0 items-center gap-1.5">
            {i > 0 ? <span aria-hidden="true" className="text-muted">/</span> : null}
            {crumb.href ? (
              <Link href={crumb.href} className="truncate text-muted transition-colors hover:text-white">{crumb.label}</Link>
            ) : (
              <span aria-current="page" className="truncate text-white">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
    </header>
  );
}

