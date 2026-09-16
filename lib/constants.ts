export const WHATSAPP_NUMBER = "237698105696";

/* ── Homepage messages ── */
export const WHATSAPP_MESSAGE_HOME =
  "Bonjour MERCO 👋 Je souhaite découvrir vos applications, scripts, solutions SaaS et opportunités digitales.";
export const WHATSAPP_LINK_HOME = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE_HOME)}`;

/* ── Default (backward-compatible) message used by shared components ── */
export const WHATSAPP_MESSAGE =
  "Bonjour MERCO 👋 Je viens de Google et je souhaite en savoir plus sur vos solutions.";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export const PRICE_TEXT = "10 000 FCFA";

/* ── Library messages (secondary product) ── */
export const WHATSAPP_MESSAGE_LIBRARY =
  "Bonjour MERCO 👋 Je veux activer mon accès à vie à la bibliothèque MERCO (10 000 FCFA). Envoyez-moi les instructions.";
export const WHATSAPP_LINK_LIBRARY = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE_LIBRARY)}`;

export const WHATSAPP_MESSAGE_LIBRARY_DISCOVER =
  "Bonjour MERCO 👋 Je souhaite découvrir l'offre bibliothèque à vie à 10 000 FCFA.";
export const WHATSAPP_LINK_LIBRARY_DISCOVER = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE_LIBRARY_DISCOVER)}`;

export const WHATSAPP_MESSAGE_DEMO =
  "Bonjour MERCO 👋 Je souhaite voir une démonstration des SaaS disponibles avant de choisir mon plan.";
export const WHATSAPP_LINK_DEMO = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE_DEMO)}`;

/* ── Business plan messages ── */
export const WHATSAPP_MESSAGE_STARTER =
  "Bonjour MERCO 👋 Je souhaite démarrer BUSINESS STARTER à 9 $/mois pendant les 12 premiers mois. J'ai compris que le tarif passe ensuite à 45 $/mois.";
export const WHATSAPP_LINK_STARTER = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE_STARTER)}`;

export const WHATSAPP_MESSAGE_PRO =
  "Bonjour MERCO 👋 Je souhaite démarrer BUSINESS PRO à 18 $/mois pendant les 12 premiers mois. J'ai compris que le tarif passe ensuite à 65 $/mois.";
export const WHATSAPP_LINK_PRO = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE_PRO)}`;

export function saasSelectMessage(saaSName: string) {
  return `Bonjour MERCO 👋 Je souhaite lancer ce SaaS : ${saaSName}. Pouvez-vous me montrer comment fonctionne l'offre Business ?`;
}
export function saasSelectLink(saaSName: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(saasSelectMessage(saaSName))}`;
}

/* ── Events ── */
export const EVENT_DEMO_INTENT = "demo_intent";
export const EVENT_PLAN_INTENT = "business_plan_intent";
export const EVENT_SAAS_SELECT = "saas_select";
export const EVENT_CATALOG_CATEGORY = "catalog_category_click";
export const EVENT_LIBRARY_ALT = "library_alternative_click";
export const EVENT_PLAN_VIEW = "business_plan_view";
export const EVENT_NAVIGATION = "navigation_click";

/* ── Events catalogue de recherche / automatisé ── */
export const EVENT_CATALOG_VIEW = "catalog_view";
export const EVENT_CATALOG_SEARCH = "catalog_search";
export const EVENT_CATALOG_FILTER = "catalog_filter";
export const EVENT_CATALOG_PRODUCT_VIEW = "catalog_product_view";
export const EVENT_ENVATO_SOURCE_CLICK = "envato_source_click";
export const EVENT_OFFICIAL_DEMO_CLICK = "official_demo_click";
export const EVENT_DEMO_CREDENTIAL_COPY = "demo_credential_copy";
export const EVENT_VERIFICATION_REQUEST = "verification_request";

/* ── Plans (single source of truth in lib/business-pricing.ts) ── */
export { PRO as PLAN_PRO, STARTER as PLAN_STARTER } from "./business-pricing";

/* ── Library price (secondary) ── */
export const LIBRARY_PRICE = "10 000 FCFA";
export const LIBRARY_PRICE_DETAIL = "accès à vie";

export const DEMO_URL = "";
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
export const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "AW-18256411556";
