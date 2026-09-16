"use client";

import { useEffect, useState } from "react";
import { WHATSAPP_LINK } from "@/lib/constants";
import { trackWhatsAppClick } from "@/lib/tracking";
import { getWhatsAppHref } from "@/lib/utm";
import { WhatsAppIcon } from "./WhatsAppIcon";

interface StickyCTAProps {
  link?: string;
  label?: string;
  ariaLabel?: string;
  event?: string;
  location?: string;
  /** Si renseigné, affiche une seconde action secondaire à côté du CTA principal. */
  secondaryLink?: string;
  secondaryLabel?: string;
  secondaryEvent?: string;
  secondaryLocation?: string;
  secondaryAriaLabel?: string;
}

export function StickyCTA({
  link = WHATSAPP_LINK,
  label = "💬 Parler à MERCO",
  ariaLabel = "Parler à MERCO sur WhatsApp (nouvel onglet)",
  event = "whatsapp_click",
  location = "sticky_mobile",
  secondaryLink,
  secondaryLabel,
  secondaryEvent,
  secondaryLocation,
  secondaryAriaLabel,
}: StickyCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    function update() {
      const y = window.scrollY;
      const nearBottom =
        window.innerHeight + y >= document.documentElement.scrollHeight - 260;
      setVisible(y > 360 && !nearBottom);
    }
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  function handlePrimaryClick(e: React.MouseEvent<HTMLAnchorElement>) {
    trackWhatsAppClick(location, event);
    const href = getWhatsAppHref(link);
    if (href !== link) {
      e.preventDefault();
      window.open(href, "_blank", "noopener,noreferrer");
    }
  }

  function handleSecondaryClick(e: React.MouseEvent<HTMLAnchorElement>) {
    trackWhatsAppClick(
      secondaryLocation ?? "sticky_secondary",
      secondaryEvent ?? "whatsapp_click"
    );
    const href = getWhatsAppHref(secondaryLink ?? link);
    if (href !== (secondaryLink ?? link)) {
      e.preventDefault();
      window.open(href, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-4 bottom-4 z-50 flex items-center justify-center gap-2 transition-all duration-300 sm:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
      style={{ paddingBottom: "calc(0.9rem + env(safe-area-inset-bottom))" }}
    >
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        onClick={handlePrimaryClick}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-2xl shadow-accent/30"
      >
        <WhatsAppIcon className="h-4 w-4" />
        <span>{label}</span>
      </a>

      {secondaryLink && secondaryLabel ? (
        <a
          href={secondaryLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={secondaryAriaLabel ?? `${secondaryLabel} sur WhatsApp (nouvel onglet)`}
          onClick={handleSecondaryClick}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-line-soft bg-surface px-4 py-3.5 text-xs font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
        >
          <WhatsAppIcon className="h-4 w-4" />
          <span>{secondaryLabel}</span>
        </a>
      ) : null}
    </div>
  );
}