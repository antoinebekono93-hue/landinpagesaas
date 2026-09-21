import Link from "next/link";
import type { Metadata } from "next";

import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Enregistrés – MERCO Launchpad",
  description: "Vos solutions de catalogues enregistrées pour lancer plus tard avec MERCO Launchpad.",
};

const buttonLinkClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-coral px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-coral-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function LaunchpadEnregistresPage() {
  return (
    <section aria-labelledby="lp-saved-title" className="w-full">
      <header className="max-w-2xl">
        <h2 id="lp-saved-title" className="text-2xl font-bold tracking-tight text-white">
          Solutions enregistrées
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Retrouvez ici les candidats que vous avez repérés pour lancer plus
          tard. L&apos;enregistrement sera disponible avec votre compte MERCO.
        </p>
      </header>

      <Card className="mt-8 p-10">
        <div className="text-center">
          <p className="text-sm font-semibold text-white">
            Aucune solution enregistrée
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
            Explorez le catalogue et bientôt, une action « enregistrer » vous
            permettra de suivre vos candidats préférés ici.
          </p>
          <div className="mt-6">
            <Link href="/creer-saas/catalogue" className={buttonLinkClass}>
              Explorer le catalogue
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
}