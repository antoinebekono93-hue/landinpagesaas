"use client";

import { useEffect } from "react";
import { EVENT_CATALOG_PRODUCT_VIEW } from "@/lib/constants";
import { trackEvent } from "@/lib/tracking";
import { scoreBucketKey } from "@/lib/catalog/scoring";

interface ProductViewTrackerProps {
  productId: string;
  envatoItemId: string | null;
  category: string;
  status: string;
  saasScore: number;
  location: string;
}

export function ProductViewTracker({
  productId,
  envatoItemId,
  category,
  status,
  saasScore,
  location,
}: ProductViewTrackerProps) {
  useEffect(() => {
    trackEvent(EVENT_CATALOG_PRODUCT_VIEW, {
      product_id: productId,
      envato_item_id: envatoItemId ?? undefined,
      category,
      status,
      score_bucket: scoreBucketKey(saasScore),
      location,
    });
  }, [productId, envatoItemId, category, status, saasScore, location]);

  return null;
}