"use client";

import { useEffect, useRef } from "react";
import { EVENT_PLAN_VIEW } from "@/lib/constants";
import { trackEvent } from "@/lib/tracking";

/**
 * Émet business_plan_view une fois quand la section tarifs entre dans le viewport.
 */
export function PlanViewTracker() {
  const ref = useRef<HTMLDivElement>(null);
  const sent = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !sent.current) {
          sent.current = true;
          trackEvent(EVENT_PLAN_VIEW, { location: "pricing" });
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} aria-hidden="true" className="h-0 w-0" />;
}