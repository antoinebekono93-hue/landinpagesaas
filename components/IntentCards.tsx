"use client";

import Link from "next/link";
import { homeIntents } from "@/lib/content";
import { WHATSAPP_LINK_HOME } from "@/lib/constants";
import { trackWhatsAppClick } from "@/lib/tracking";
import { getWhatsAppHref } from "@/lib/utm";
import { IconBox, IconBulb, IconCode, IconPhone } from "./icons";
import type { IconProps } from "./icons";

const intentIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  saas: IconBox,
  application: IconPhone,
  code_source: IconCode,
  business: IconBulb,
};

export function IntentCards() {
  return (
    <section id="intentions" className="section-pad border-t border-line">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Votre objectif</p>
          <h2 className="section-title">Que voulez-vous lancer ?</h2>
          <p className="mt-4 text-muted">
            Choisissez votre objectif et découvrez comment MERCO peut vous
            orienter.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {homeIntents.map((intent) => {
            const Icon = intentIcons[intent.id] ?? IconBox;
            const cardInner = (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {intent.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {intent.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  {intent.cta}
                  <span aria-hidden="true">→</span>
                </span>
              </>
            );

            const cardClass =
              "flex flex-col rounded-2xl border border-line bg-gradient-to-b from-surface to-surface/[0.4] p-6 transition-colors hover:border-accent/40";

            if (intent.kind === "internal") {
              return (
                <Link
                  key={intent.id}
                  href={intent.href}
                  className={cardClass}
                  aria-label={`${intent.title} — ${intent.cta}`}
                >
                  {cardInner}
                </Link>
              );
            }

            return (
              <a
                key={intent.id}
                href={WHATSAPP_LINK_HOME}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${intent.title} — ${intent.cta} (sur WhatsApp)`}
                onClick={(event) => {
                  trackWhatsAppClick(intent.location);
                  const href = getWhatsAppHref(WHATSAPP_LINK_HOME);
                  if (href !== WHATSAPP_LINK_HOME) {
                    event.preventDefault();
                    window.open(href, "_blank", "noopener,noreferrer");
                  }
                }}
                className={cardClass}
              >
                {cardInner}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}