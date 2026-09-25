"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, DownloadCloud, Lock, Server } from "lucide-react";

type ProductActionButtonsProps = {
  /** true = téléchargement libre (admin MERCO), false = abonnement requis */
  isFreeDownload: boolean;
  /** URL directe du fichier .zip */
  downloadUrl: string;
  /** défaut : navigation vers /creer-saas/hebergement */
  onHostingClick?: () => void;
};

export function ProductActionButtons({
  isFreeDownload,
  downloadUrl,
  onHostingClick,
}: ProductActionButtonsProps) {
  const router = useRouter();

  // TODO(Medusa) : brancher sur la session utilisateur / abonnement réel
  const isLoggedIn = false;
  const isPremiumSubscriber = false;

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const isGated = !isFreeDownload;
  const canDownload = !isGated || (isLoggedIn && isPremiumSubscriber);

  function handleDownloadClick() {
    if (!canDownload) {
      setShowPremiumModal(true);
      return;
    }
    window.location.assign(downloadUrl);
  }

  function handleHostingClick() {
    if (onHostingClick) {
      onHostingClick();
      return;
    }
    router.push("/creer-saas/hebergement");
  }

  const downloadLabel = !isGated
    ? "Télécharger le Code"
    : isLoggedIn && isPremiumSubscriber
      ? "Télécharger (Inclus Premium)"
      : "Télécharger (Premium)";

  const downloadClassName = !isGated
    ? "bg-zinc-800 text-white hover:bg-zinc-700"
    : isLoggedIn && isPremiumSubscriber
      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500"
      : "border border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 hover:text-white";

  return (
    <div className="rounded-xl bg-zinc-900 p-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleDownloadClick}
          aria-haspopup={!canDownload ? "dialog" : undefined}
          className={`inline-flex h-14 flex-1 items-center justify-center rounded-lg px-5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${downloadClassName}`}
        >
          {downloadLabel}
          {!isGated ? (
            <Download className="ml-2 h-5 w-5" />
          ) : isLoggedIn && isPremiumSubscriber ? (
            <DownloadCloud className="ml-2 h-5 w-5" />
          ) : (
            <Lock className="ml-2 h-4 w-4" />
          )}
        </button>

        <button
          type="button"
          onClick={handleHostingClick}
          className="inline-flex h-14 flex-1 items-center justify-center rounded-lg border border-zinc-700 bg-transparent px-5 text-sm font-semibold text-white transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-800 active:scale-[0.98]"
        >
          Héberger mon SaaS (Hosting)
          <Server className="ml-2 h-5 w-5" />
        </button>
      </div>

      {showPremiumModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="premium-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
          onClick={() => setShowPremiumModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-400">
              <Lock className="h-5 w-5" />
            </div>
            <h2
              id="premium-modal-title"
              className="mt-4 text-lg font-bold text-white"
            >
              Abonnement Requis
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Ce script est réservé aux membres Premium. Rejoignez le Club MERCO
              pour le télécharger.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/creer-saas/premium"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-slate-950 transition-all duration-200 hover:bg-accent-strong"
              >
                Rejoindre le Club MERCO
              </Link>
              <button
                type="button"
                onClick={() => setShowPremiumModal(false)}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-700 px-4 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:border-zinc-500 hover:text-white"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
