"use client";

import {
  EVENT_LIBRARY_ALT,
  LIBRARY_PRICE,
  LIBRARY_PRICE_DETAIL,
  WHATSAPP_LINK_LIBRARY,
} from "@/lib/constants";
import { trackEvent } from "@/lib/tracking";
import { getWhatsAppHref } from "@/lib/utm";

export function LibraryAlternative() {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    trackEvent(EVENT_LIBRARY_ALT, { location: "library_alternative" });
    const href = getWhatsAppHref(WHATSAPP_LINK_LIBRARY);
    if (href !== WHATSAPP_LINK_LIBRARY) {
      event.preventDefault();
      window.open(href, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <section className="section-pad border-t border-line bg-surface/[0.35]">
      <div className="container-page">
        <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-surface p-8 text-center">
          <p className="text-sm text-slate-200">
            Vous êtes développeur et préférez gérer vous-même vos projets ?
          </p>
          <a
            href={WHATSAPP_LINK_LIBRARY}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-line-soft bg-surface-2 px-6 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
          >
            Découvrir l&apos;accès bibliothèque MERCO
          </a>
          <p className="mt-3 text-xs font-medium text-muted">
            {LIBRARY_PRICE} • {LIBRARY_PRICE_DETAIL}
          </p>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Une offre complémentaire, distincte de l&apos;abonnement Business.
          </p>
        </div>
      </div>
    </section>
  );
}