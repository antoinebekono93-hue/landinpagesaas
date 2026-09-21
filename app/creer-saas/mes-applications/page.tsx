import Link from "next/link";

import { LaunchpadShell } from "@/components/launchpad/shell/LaunchpadShell";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

const empties = [0, 1, 2];

export default function MesApplicationsPage() {
	return (
		<LaunchpadShell
			title="Mes applications"
			crumbs={[{ label: "Mes applications" }]}
		>
			<section aria-labelledby="mes-title" className="w-full">
				<header className="flex flex-wrap items-end justify-between gap-4">
					<div>
						<h2 id="mes-title" className="text-lg font-bold text-white">
							Mes applications
						</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Aucune application lancée pour le moment.
						</p>
					</div>
					<Button asChild>
						<Link href="/creer-saas/launchpad/catalogue">
							Découvrir le catalogue
						</Link>
					</Button>
				</header>

				<div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{empties.map((i) => (
						<Card key={i}>
							<CardContent className="space-y-3 p-6">
								<Skeleton className="h-9 w-9" />
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-3 w-1/2" />
								<Skeleton className="mt-5 h-8 w-full" />
							</CardContent>
						</Card>
					))}
				</div>

				<p className="mt-8 text-center text-sm text-muted-foreground">
					Vos applications apparaîtront ici après votre premier
					déploiement launchpad.
				</p>
			</section>
		</LaunchpadShell>
	);
}
