"use client";

import { EVENT_OFFICIAL_DEMO_CLICK } from "@/lib/constants";
import { trackEvent } from "@/lib/tracking";
import { IconPlay } from "@/components/icons";
import { ProductSourceLink } from "./ProductSourceLink";

interface OfficialDemoCardProps {
  productId: string;
  envatoItemId: string | null;
  category: string;
  productName: string;
  previewUrl: string | null;
  sourceUrl: string;
  location: string;
}

export function OfficialDemoCard({
  productId,
  envatoItemId,
  category,
  productName,
  previewUrl,
  sourceUrl,
  location,
}: OfficialDemoCardProps) {
  function handleDemoClick() {
    if (!previewUrl) return;
    trackEvent(EVENT_OFFICIAL_DEMO_CLICK, {
      product_id: productId,
      envato_item_id: envatoItemId ?? undefined,
      category,
      location,
    });
  }

  return (
    <div className="card p-5">
      <h2 className="text-base font-semibold text-white">Démo officielle</h2>
      {previewUrl ? (
        <>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Démonstration publiée par l&apos;éditeur de {productName}. Elle peut
            changer ou être désactivée à tout moment.
          </p>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDemoClick}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#1fce5e]"
          >
            <IconPlay className="h-4 w-4" />
            Tester la démo officielle
          </a>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            La démo officielle est accessible depuis la page source du vendeur.
            MERCO n&apos;invente aucune URL de démonstration.
          </p>
          <div className="mt-4">
            <ProductSourceLink
              url={sourceUrl}
              productId={productId}
              envatoItemId={envatoItemId}
              category={category}
              location={`${location}_demo_fallback`}
            />
          </div>
        </>
      )}
    </div>
  );
}