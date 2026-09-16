declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(
  event: string,
  params?: Record<string, string | number | undefined>
): void {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer ?? [];
    const payload = { ...params };
    if (typeof window.gtag === "function") {
      window.gtag("event", event, {
        event_category: params?.event_category ?? "merco",
        event_label: params?.category ?? params?.saas_id ?? params?.plan ?? params?.location,
        ...payload,
      });
    } else {
      window.dataLayer.push({ event, ...payload });
    }
  } catch {
    // Never block navigation.
  }
}

/** Backward-compatible helper used by WhatsAppButton and StickyCTA. */
export function trackWhatsAppClick(location: string, event = "whatsapp_click"): void {
  trackEvent(event, { location, event_category: "whatsapp" });
}

/** Google Ads conversion – objectif « Abonnement ». */
export const ADS_CONVERSION_SEND_TO = "AW-18256411556/8WxCCIfRveMcEKT3qoFE";

export function trackConversion(extra?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: ADS_CONVERSION_SEND_TO,
        ...extra,
      });
    } else {
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({
        event: "conversion",
        send_to: ADS_CONVERSION_SEND_TO,
        ...extra,
      });
    }
  } catch {
    // Never block navigation.
  }
}