"use client";

import { WHATSAPP_LINK } from "@/lib/constants";
import { trackWhatsAppClick } from "@/lib/tracking";
import { getWhatsAppHref } from "@/lib/utm";
import { WhatsAppIcon } from "./WhatsAppIcon";

interface WhatsAppButtonProps {
  children: React.ReactNode;
  location: string;
  link?: string;
  event?: string;
  variant?: "primary" | "outline";
  size?: "md" | "lg";
  className?: string;
  fullWidth?: boolean;
  ariaLabel?: string;
}

export function WhatsAppButton({
  children,
  location,
  link = WHATSAPP_LINK,
  event: eventName = "whatsapp_click",
  variant = "primary",
  size = "md",
  className = "",
  fullWidth = false,
  ariaLabel,
}: WhatsAppButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2.5 rounded-full font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  const variants = {
    primary:
      "bg-accent text-slate-950 hover:bg-[#1fce5e] active:bg-[#18b84f]",
    outline:
      "border border-line-soft text-slate-100 hover:border-accent-soft hover:text-white",
  };

  const sizes = {
    md: "px-5 py-3 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  const label =
    typeof children === "string" ? children.trim() : "Découvrir MERCO";

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    trackWhatsAppClick(location, eventName);
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
      aria-label={ariaLabel ?? `${label} sur WhatsApp (nouvel onglet)`}
      onClick={handleClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      <WhatsAppIcon className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
      <span>{children}</span>
    </a>
  );
}