import Link from "next/link";

import { LaunchpadShell } from "@/components/launchpad/shell/LaunchpadShell";
import { Card } from "@/components/ui/Card";

const steps = [
  {
    title: "Découvrir",
    description:
      "Parcourez le catalogue MERCO : des SaaS prêts à lancer, détectés sur Envato Market, scorés et vérifiés.",
    href: "/creer-saas/launchpad/catalogue",
    cta: "Parcourir le catalogue",
  },
  {
    title: "Choisir",
    description:
      "Comparez catégories, prix source et score MERCO pour sélectionner le SaaS qui correspond à votre métier.",
    href: "/creer-saas/launchpad/opportunites",
    cta: "Voir les opportunités",
  },
  {
    title: "Déployer",
    description:
      "Une fois disponible commercialement, lancez votre application et suivez vos déploiements depuis cet espace.",
    href: "/creer-saas/launchpad/deploiements",
    cta: "Suivre les déploiements",
  },
  {
    title: "Gérer",
    description:
      "Retrouvez vos applications lancées, leurs statuts et vos prochaines étapes dans votre espace personnel.",
    href: "/creer-saas/mes-applications",
    cta: "Voir mes applications",
  },
];

const buttonLinkClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-coral px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-coral-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const secondaryLinkClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface-2 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-surface-3";

export default function LaunchpadDecouvrirPage() {
  return (
    <LaunchpadShell
      title="Découvrir"
      crumbs={[
        { label: "Launchpad", href: "/creer-saas/launchpad/decouvrir" },
        { label: "Découvrir" },
      ]}
    >
      <section aria-labelledby="lp-hero" className="w-full">
        <div className="max-w-2xl">
          <h2 id="lp-hero" className="text-2xl font-bold tracking-tight text-white">
            Lancez votre SaaS en quelques étapes
          </h2>
          <p className="mt-2 leading-relaxed text-muted">
            MERCO Launchpad transforme de vrais produits Envato Market en
            applications commercialement prêtes : licence vérifiée, audit
            technique, et mise en ligne pour votre activité.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/creer-saas/launchpad/catalogue" className={buttonLinkClass}>
              Découvrir le catalogue
            </Link>
            <Link href="/creer-saas/launchpad/opportunites" className={secondaryLinkClass}>
              Voir les opportunités
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {steps.map((step, index) => (
            <Card key={step.title} className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-coral font-black text-slate-950">
                  {index + 1}
                </span>
                <h3 className="font-semibold tracking-tight text-white">
                  {step.title}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
              <div className="mt-5">
                <Link href={step.href} className={secondaryLinkClass}>
                  {step.cta}
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </LaunchpadShell>
  );
}