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

export const WHATSAPP_MESSAGE_DEMO =
  "Bonjour MERCO 👋 Je souhaite voir une démonstration des SaaS disponibles avant de choisir mon plan.";
export const WHATSAPP_LINK_DEMO = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE_DEMO)}`;

/* ── Business plan messages ── */
export const WHATSAPP_MESSAGE_STARTER =
  "Bonjour MERCO 👋 Je souhaite souscrire au plan BUSINESS STARTER à 5 000 FCFA/mois et choisir mes 2 SaaS.";
export const WHATSAPP_LINK_STARTER = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE_STARTER)}`;

export const WHATSAPP_MESSAGE_PRO =
  "Bonjour MERCO 👋 Je souhaite souscrire au plan BUSINESS PRO à 10 000 FCFA/mois et choisir mes 5 SaaS.";
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

/* ── Plans ── */
export const PLAN_STARTER = {
  id: "starter",
  name: "Business Starter",
  badge: null as string | null,
  price: "5 000 FCFA",
  priceDetail: "/mois",
  saasLimit: 2,
  promise: "Lancez jusqu'à 2 SaaS",
  cta: "Démarrer avec 2 SaaS",
  features: [
    "Jusqu'à 2 SaaS actifs",
    "Hébergement inclus selon les limites du plan",
    "SSL",
    "Maintenance technique de base",
    "Accès administrateur selon la solution",
    "Orientation MERCO",
    "Possibilité de remplacer un SaaS selon les conditions MERCO",
    "Support WhatsApp",
  ],
} as const;

export const PLAN_PRO = {
  id: "pro",
  name: "Business Pro",
  badge: "Le plus populaire",
  price: "10 000 FCFA",
  priceDetail: "/mois",
  saasLimit: 5,
  promise: "Lancez jusqu'à 5 SaaS",
  cta: "Démarrer avec 5 SaaS",
  features: [
    "Jusqu'à 5 SaaS actifs",
    "Hébergement inclus selon les limites du plan",
    "SSL",
    "Maintenance technique de base",
    "Accès administrateur selon la solution",
    "Orientation MERCO",
    "Possibilité de construire un portefeuille de plusieurs services",
    "Support WhatsApp",
  ],
} as const;

/* ── Library price (secondary) ── */
export const LIBRARY_PRICE = "10 000 FCFA";
export const LIBRARY_PRICE_DETAIL = "accès à vie";

export const DEMO_URL = "";
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
