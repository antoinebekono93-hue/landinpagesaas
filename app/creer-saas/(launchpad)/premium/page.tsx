import type { Metadata } from "next";

import { waLink } from "@/lib/catalog/cta";

export const metadata: Metadata = {
  title: "MERCO Premium",
  description:
    "MERCO Premium : l'abonnement global qui débloque toutes les ressources Premium du catalogue. Tarifs réels communiqués sur WhatsApp, aucune donnée fictive.",
};

const CTA_MESSAGE =
  "Bonjour MERCO 👋 Je souhaite activer MERCO Premium. Pouvez-vous me communiquer les modalités et le tarif réel ?";

export default function PremiumPage() {
  const ctaHref = waLink(CTA_MESSAGE);
  const perks = [
    "Un seul abonnement, toutes les ressources Premium du catalogue",
    "Abonnement global : jamais d'achat par produit ni par fichier",
    "Activation réelle via WhatsApp, sans donnée fictive",
  ];

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-white">
        MERCO Premium
      </h1>
      <p className="mt-4 leading-relaxed text-slate-200">
        MERCO Premium est un <strong>abonnement global</strong> : il débloque
        l&apos;ensemble des ressources Premium du catalogue MERCO, sans achat
        par produit ni par fichier.
      </p>

      <ul className="mt-6 space-y-2">
        {perks.map((perk) => (
          <li
            key={perk}
            className="rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm text-slate-200"
          >
            {perk}
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-muted">
        Le tarif vous est communiqué par notre équipe sur WhatsApp : nous
        n&apos;affichons aucun prix inventé ici.
      </p>

      <a
        href={ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-slate-950 transition-colors hover:bg-[#1fce5e]"
      >
        Activer MERCO Premium sur WhatsApp
      </a>
    </main>
  );
}
