"use client";

import { EVENT_SAAS_SELECT, EVENT_VERIFICATION_REQUEST } from "@/lib/constants";
import { trackEvent } from "@/lib/tracking";
import { getWhatsAppHref } from "@/lib/utm";
import { productSelectLink, productVerificationLink } from "@/lib/catalog/cta";
import { scoreBucketKey } from "@/lib/catalog/scoring";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

interface ProductCtaProps {
  productId: string;
  envatoItemId: string | null;
  name: string;
  category: string;
  status: string;
  saasScore: number;
  available: boolean;
  location: string;
  variant?: "primary" | "card";
}

export function ProductCta({
  productId,
  envatoItemId,
  name,
  category,
  status,
  saasScore,
  available,
  location,
  variant = "primary",
}: ProductCtaProps) {
  const message = available
    ? "Je souhaite ajouter ce SaaS à mon plan MERCO Business."
    : "Pouvez-vous vérifier sa disponibilité avec MERCO Business ?";
  const label = available ? "Choisir ce SaaS" : "Demander sa vérification";
  const baseLink = available
    ? productSelectLink(name)
    : productVerificationLink(name);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    const params = {
      product_id: productId,
      envato_item_id: envatoItemId ?? undefined,
      category,
      status,
      score_bucket: scoreBucketKey(saasScore),
      location,
    };
    trackEvent(available ? EVENT_SAAS_SELECT : EVENT_VERIFICATION_REQUEST, params);
    const href = getWhatsAppHref(baseLink);
    if (href !== baseLink) {
      event.preventDefault();
      window.open(href, "_blank", "noopener,noreferrer");
    }
  }

  const classes =
    variant === "card"
      ? "w-full rounded-full px-4 py-2.5 text-sm"
      : "rounded-full px-6 py-3.5 text-base";

  return (
    <a
      href={baseLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} sur WhatsApp (nouvel onglet)`}
      onClick={handleClick}
      title={message}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-colors ${
        available
          ? "bg-accent text-slate-950 hover:bg-[#1fce5e]"
          : "border border-accent-soft/60 bg-accent/10 text-accent-soft hover:bg-accent/20"
      } ${classes}`}
    >
      <WhatsAppIcon className="h-4 w-4" />
      {label}
    </a>
  );
}