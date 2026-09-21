import Link from "next/link";
import type { Metadata } from "next";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Déploiements – MERCO Launchpad",
  description: "Suivez vos déploiements MERCO Launchpad en temps réel.",
};

const empty = [0, 1, 2];

export default function LaunchpadDeploiementsPage() {
  return (
    <section aria-labelledby="lp-deploy-title" className="w-full">
      <header className="max-w-2xl">
        <h2 id="lp-deploy-title" className="text-2xl font-bold tracking-tight text-white">
          Déploiements
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Les lancements de vos applications, l&apos;infrastructure et les
          statuts de mise en ligne apparaîtront ici une fois votre premier
          SaaS activé.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {empty.map((i) => (
          <Card key={i}>
            <div className="space-y-3">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="mt-5 h-8 w-full" />
            </div>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        Aucun déploiement en cours. Votre premier déploiement apparaîtra
        après activation d&apos;une solution du{" "}
        <Link
          href="/creer-saas/catalogue"
          className="font-semibold text-white underline-offset-4 hover:underline"
        >
          catalogue
        </Link>
        .
      </p>
    </section>
  );
}