"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { LaunchpadShell } from "@/components/launchpad/shell/LaunchpadShell";

const LABELS: Record<string, string> = {
  catalogue: "Catalogue",
  "mes-applications": "Mes applications",
  opportunites: "Opportunités",
  enregistres: "Enregistrés",
  deploiements: "Déploiements",
};

export default function LaunchpadLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const current = segments[1] ?? "catalogue";
  const isProductSheet = current === "catalogue" && segments.length > 2;
  const title = isProductSheet ? "Fiche produit" : LABELS[current] ?? "Catalogue";
  const crumbs = isProductSheet
    ? [
        { label: "Catalogue", href: "/creer-saas/catalogue" },
        { label: "Fiche produit" },
      ]
    : [{ label: title }];

  return (
    <LaunchpadShell title={title} crumbs={crumbs}>
      {children}
    </LaunchpadShell>
  );
}