declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackWhatsAppClick(location: string): void {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer ?? [];
    if (typeof window.gtag === "function") {
      window.gtag("event", "whatsapp_click", {
        location,
        event_category: "whatsapp",
        event_label: location,
      });
    } else {
      window.dataLayer.push({ event: "whatsapp_click", location });
    }
  } catch {
    // Never block the WhatsApp navigation.
  }
}