"use client";

import { EVENT_PLAN_VIEW } from "@/lib/constants";
import { trackEvent } from "@/lib/tracking";

/**
 * Barre collante mobile → fait défiler vers la section tarifs.
 * Ne bascule pas directement sur WhatsApp.
 */
export function BusinessStickyCTA() {
  function handleClick() {
    trackEvent(EVENT_PLAN_VIEW, { location: "sticky_mobile" });
    document.getElementById("tarifs")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 p-3 backdrop-blur sm:hidden">
      <button
        type="button"
        onClick={handleClick}
        className="w-full rounded-full bg-accent px-5 py-3.5 text-sm font-bold text-slate-950 transition-colors hover:bg-[#1fce5e]"
      >
        Lancer mes SaaS dès 5 000 F/mois
      </button>
    </div>
  );
}