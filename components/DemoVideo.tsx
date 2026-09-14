"use client";

import { useState } from "react";
import { DEMO_URL, WHATSAPP_LINK } from "@/lib/constants";
import { trackWhatsAppClick } from "@/lib/tracking";
import { getWhatsAppHref } from "@/lib/utm";
import { LibraryMockup } from "./LibraryMockup";
import { IconPlay } from "./icons";

export function DemoVideo() {
  const [playing, setPlaying] = useState(false);

  if (DEMO_URL && playing) {
    return (
      <video
        className="aspect-video w-full rounded-2xl border border-line bg-black"
        src={DEMO_URL}
        controls
        autoPlay
        playsInline
        preload="auto"
      />
    );
  }

  function handleClick() {
    if (DEMO_URL) {
      setPlaying(true);
      return;
    }
    trackWhatsAppClick("demo");
    const href = getWhatsAppHref(WHATSAPP_LINK);
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Voir la démo MERCO"
      className="relative block w-full cursor-pointer overflow-hidden rounded-2xl border border-line bg-surface text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <LibraryMockup compact className="pointer-events-none" />
      <span className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-gradient-to-t from-background/80 via-background/20 to-transparent">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-slate-950 shadow-2xl shadow-accent/30">
          <IconPlay className="h-6 w-6 pl-0.5" />
        </span>
        <span className="rounded-full border border-line-soft bg-background/90 px-4 py-1.5 text-sm font-semibold text-white">
          Voir la démo
        </span>
      </span>
    </button>
  );
}