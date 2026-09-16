"use client";

import { EVENT_LIBRARY_ALT, WHATSAPP_LINK_LIBRARY_DISCOVER } from "@/lib/constants";
import { trackEvent } from "@/lib/tracking";
import { getWhatsAppHref } from "@/lib/utm";

interface LibraryCtaProps {
  label?: string;
  variant?: "primary" | "outline";
  fullWidth?: boolean;
}

export function LibraryCta({
  label = "Découvrir la bibliothèque",
  variant = "primary",
  fullWidth = false,
}: LibraryCtaProps) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    trackEvent(EVENT_LIBRARY_ALT, { location: "library_page" });
    const href = getWhatsAppHref(WHATSAPP_LINK_LIBRARY_DISCOVER);
    if (href !== WHATSAPP_LINK_LIBRARY_DISCOVER) {
      event.preventDefault();
      window.open(href, "_blank", "noopener,noreferrer");
    }
  }

  const base =
    "inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
  const classes =
    variant === "primary"
      ? "bg-accent text-slate-950 hover:bg-[#1fce5e] px-6 py-3"
      : "border border-line-soft text-slate-100 hover:border-accent-soft hover:text-white px-6 py-3";

  return (
    <a
      href={WHATSAPP_LINK_LIBRARY_DISCOVER}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} sur WhatsApp (nouvel onglet)`}
      onClick={handleClick}
      className={`${base} ${classes} ${fullWidth ? "w-full" : ""}`}
    >
      {label}
    </a>
  );
}