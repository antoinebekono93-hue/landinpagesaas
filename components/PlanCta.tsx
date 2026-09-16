"use client";

import { EVENT_PLAN_INTENT } from "@/lib/constants";
import { businessPlanById } from "@/lib/business-pricing";
import { trackEvent } from "@/lib/tracking";
import { getWhatsAppHref } from "@/lib/utm";
import { WhatsAppIcon } from "./WhatsAppIcon";

interface PlanCtaProps {
  plan: "starter" | "pro";
  label: string;
  link: string;
  location: string;
  variant?: "primary" | "outline";
}

export function PlanCta({
  plan,
  label,
  link,
  location,
  variant = "primary",
}: PlanCtaProps) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    const pricing = businessPlanById(plan);
    trackEvent(EVENT_PLAN_INTENT, {
      plan,
      location,
      intro_price: pricing.introductoryMonthlyPrice,
      regular_price: pricing.regularMonthlyPrice,
      intro_months: pricing.introductoryMonths,
    });
    const href = getWhatsAppHref(link);
    if (href !== link) {
      event.preventDefault();
      window.open(href, "_blank", "noopener,noreferrer");
    }
  }

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors";
  const classes =
    variant === "primary"
      ? "bg-accent text-slate-950 hover:bg-[#1fce5e] px-6 py-3"
      : "border border-line-soft text-slate-100 hover:border-accent-soft hover:text-white px-6 py-3";

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} sur WhatsApp (nouvel onglet)`}
      onClick={handleClick}
      className={`${base} ${classes}`}
    >
      <WhatsAppIcon className="h-4 w-4" />
      <span>{label}</span>
    </a>
  );
}