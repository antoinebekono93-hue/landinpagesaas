import { useState } from "react";
import { Download, DownloadCloud, Lock, Server } from "lucide-react";
import { waLink } from "@/lib/catalog/cta";

/**
 * ProductActionButtons — Les deux actions principales d'une fiche produit du
 * catalogue MERCO.
 *
 *   1) Bouton A (dynamique) — Téléchargement du code source du SaaS :
 *      • produit en téléchargement LIBRE  → « Télécharger le Code » (fond Zinc/épuré)
 *      • abonnement requis + utilisateur Premium → « Télécharger (Inclus Premium) »
 *        (dégradé indigo → violet, icône DownloadCloud)
 *      • abonnement requis + non-Premium → « Télécharger (Premium) » : ouvre la
 *        modale « Abonnement Requis » au clic.
 *   2) Bouton B (fixe) — Hébergement managé : « Héberger mon SaaS (Hosting) »,
 *      fait défiler en douceur vers la section ProductServiceCtas de la fiche.
 *
 * ── Intégration des données réelles ──────────────────────────────────────────
 *   • isFreeDownload   ← champ « téléchargement libre ? » du produit (admin MERCO).
 *   • downloadUrl      ← URL du fichier .zip produite côté serveur.
 *   • isLoggedIn       ← à brancher sur ta session utilisateur (Medusa / Nhost).
 *   • isPremiumSubscriber ← à brancher sur l'abonnement Premium réel.
 *   Les deux derniers sont des placeholders (constantes) à remplacer par ton
 *   contexte d'authentification — voir lib/catalog/premium.ts.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const PREMIUM_MODAL_ID = "abonnement-requis";

type ProductActionButtonsProps = {
  isFreeDownload: boolean;
  downloadUrl: string;
  onHostingClick: () => void;
};

export function ProductActionButtons({
  isFreeDownload,
  downloadUrl,
  onHostingClick,
}: ProductActionButtonsProps) {
  /* ── Placeholders de session — remplacer par ton contexte réel ── */
  const isLoggedIn = false; // TODO(Medusa) : brancher la session utilisateur
  const isPremiumSubscriber = false; // TODO(Medusa) : brancher l'abonnement Premium
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const isGated = !isFreeDownload;

  function handleDownloadClick() {
    if (!isGated || (isLoggedIn && isPremiumSubscriber)) {
      window.location.assign(downloadUrl);
      return;
    }
    setShowPremiumModal(true);
  }

  function downloadLabel(): string {
    if (!isGated) return "Télécharger le Code";
    if (isLoggedIn && isPremiumSubscriber) return "Télécharger (Inclus Premium)";
    return "Télécharger (Premium)";
  }

  function downloadClass(): string {
    if (!isGated) {
      return "inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-zinc-800 active:scale-[0.98]";
    }
    if (isLoggedIn && isPremiumSubscriber) {
      return "inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]";
    }
    return "inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-lg border border-line-soft bg-surface-2/50 px-5 text-sm font-semibold text-slate-100 transition-all duration-200 hover:border-accent-soft hover:text-white active:scale-[0.98]";
  }

  function downloadIcon() {
    if (!isGated) return <Download className="ml-2 h-5 w-5" aria-hidden="true" />;
    if (isLoggedIn && isPremiumSubscriber) return <DownloadCloud className="ml-2 h-5 w-5" aria-hidden="true" />;
    return <Lock className="ml-2 h-4 w-4" aria-hidden="true" />;
  }

  return (
    <>
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleDownloadClick}
          aria-haspopup={isGated && !(isLoggedIn && isPremiumSubscriber) ? "dialog" : undefined}
          className={downloadClass()}
        >
          {downloadLabel()}
          {downloadIcon()}
        </button>

        <button
          type="button"
          onClick={onHostingClick}
          aria-label="Héberger mon SaaS (Hosting)"
          className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-lg border border-line-soft bg-transparent px-5 text-sm font-semibold text-slate-100 transition-all duration-200 hover:border-accent-soft hover:text-white active:scale-[0.98]"
        >
          Héberger mon SaaS (Hosting)
          <Server className="ml-2 h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {showPremiumModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${PREMIUM_MODAL_ID}-title`}
          aria-describedby={`${PREMIUM_MODAL_ID}-desc`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
          onClick={() => setShowPremiumModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-line-soft bg-surface-2 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Lock className="h-5 w-5" />
            </div>
            <h2 id={`${PREMIUM_MODAL_ID}-title`} className="mt-4 text-lg font-bold text-slate-100">
              Abonnement Requis
            </h2>
            <p id={`${PREMIUM_MODAL_ID}-desc`} className="mt-2 text-sm leading-relaxed text-muted">
              Ce code source est réservé aux membres Premium. Rejoignez le Club MERCO
              pour le télécharger.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <a
                href={waLink("Bonjour MERCO 👋 Je souhaite passer à Premium pour télécharger ce code source.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-slate-950 transition-all duration-200 hover:bg-accent-strong"
              >
                Passer à Premium
              </a>
              <button
                type="button"
                onClick={() => setShowPremiumModal(false)}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-line-soft px-4 text-sm font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
