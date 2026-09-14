const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
] as const;

export function getWhatsAppHref(baseUrl: string): string {
  if (typeof window === "undefined") return baseUrl;
  try {
    const incoming = new URLSearchParams(window.location.search);
    const preserved = new URLSearchParams();
    let hasUtm = false;
    for (const key of UTM_KEYS) {
      const value = incoming.get(key);
      if (value) {
        preserved.set(key, value);
        hasUtm = true;
      }
    }
    if (!hasUtm) return baseUrl;
    const url = new URL(baseUrl);
    preserved.forEach((value, key) => url.searchParams.set(key, value));
    return url.toString();
  } catch {
    return baseUrl;
  }
}