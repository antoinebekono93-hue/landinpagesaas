"use client";

import { EVENT_ENVATO_SOURCE_CLICK } from "@/lib/constants";
import { trackEvent } from "@/lib/tracking";
import { IconExternal } from "@/components/icons";

interface ProductSourceLinkProps {
  url: string;
  productId: string;
  envatoItemId: string | null;
  category: string;
  location: string;
  label?: string;
  variant?: "primary" | "outline";
}

export function ProductSourceLink({
  url,
  productId,
  envatoItemId,
  category,
  location,
  label = "Ouvrir la source officielle",
  variant = "outline",
}: ProductSourceLinkProps) {
  function handleClick() {
    trackEvent(EVENT_ENVATO_SOURCE_CLICK, {
      product_id: productId,
      envato_item_id: envatoItemId ?? undefined,
      category,
      location,
    });
  }

  const classes =
    variant === "primary"
      ? "bg-accent text-slate-950 hover:bg-[#1fce5e] px-5 py-3"
      : "border border-line-soft text-slate-100 hover:border-accent-soft hover:text-white px-5 py-3";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors ${classes}`}
    >
      <IconExternal className="h-4 w-4" />
      {label}
    </a>
  );
}