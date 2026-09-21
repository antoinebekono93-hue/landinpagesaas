import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

const empties = [0, 1, 2];

const buttonLinkClass =
	"inline-flex items-center justify-center gap-2 rounded-full bg-coral px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-coral-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function MesApplicationsPage() {
	return (
		<section aria-labelledby="mes-title" className="w-full">
			<header className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h2 id="mes-title" className="text-lg font-bold text-white">
						Mes applications
					</h2>
					<p className="mt-1 text-sm text-muted">
						Aucune application lancée pour le moment.
					</p>
				</div>
				<Link href="/creer-saas/catalogue" className={buttonLinkClass}>
					Découvrir le catalogue
				</Link>
			</header>

			<div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{empties.map((i) => (
					<Card key={i}>
						<div className="space-y-3">
							<Skeleton className="h-9 w-9" />
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-3 w-1/2" />
							<Skeleton className="mt-5 h-8 w-full" />
						</div>
					</Card>
				))}
			</div>

			<p className="mt-8 text-center text-sm text-muted">
				Vos applications apparaîtront ici après votre premier déploiement
				launchpad.
			</p>
		</section>
	);
}