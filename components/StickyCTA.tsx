"use client";

import { useEffect, useState } from "react";
import { WHATSAPP_LINK } from "@/lib/constants";
import { trackWhatsAppClick } from "@/lib/tracking";
import { getWhatsAppHref } from "@/lib/utm";

interface StickyCTAProps {
  link?: string;
  label?: string;
  ariaLabel?: string;
}

export function StickyCTA({
  link = WHATSAPP_LINK,
  label = "💬 Parler à MERCO",
  ariaLabel = "Parler à MERCO sur WhatsApp (nouvel onglet)",
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

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    trackWhatsAppClick("sticky_mobile");
    const href = getWhatsAppHref(link);
    if (href !== link) {
      event.preventDefault();
      window.open(href, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      onClick={handleClick}
      className={`fixed inset-x-4 bottom-4 z-50 flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-2xl shadow-accent/30 transition-all duration-300 sm:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
      style={{ paddingBottom: "calc(0.9rem + env(safe-area-inset-bottom))" }}
    >
      {label}
    </a>
  );
}