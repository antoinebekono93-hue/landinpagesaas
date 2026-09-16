/**
 * Requêtes de recherche Envato Market par catégorie MERCO.
 *
 * Chaque catégorie possède plusieurs recherches afin d'améliorer le rappel
 * (recall) sur l'API Envato. Les résultats sont ensuite filtrés sur
 * CodeCanyon, dédupliqués par `id`, puis scorés et UPSERTés dans Nhost.
 */

export type CategoryQueryConfig = {
  key: string;
  label: string;
  queries: string[];
};

/**
 * Catégories officielles MERCO (clés + libellés).
 * Il ne faut PAS en créer d'autres sans valider le modèle de données.
 */
export const MERCO_CATEGORIES = [
  { key: "crm-sales", label: "CRM & ventes" },
  { key: "booking", label: "Réservation" },
  { key: "ecommerce", label: "E-commerce" },
  { key: "education", label: "Éducation" },
  { key: "hr-management", label: "RH & gestion" },
  { key: "website-builder", label: "Création de sites" },
  { key: "logistics", label: "Logistique" },
  { key: "whatsapp-crm", label: "WhatsApp & relation client" },
] as const;

export type MercoCategoryKey = (typeof MERCO_CATEGORIES)[number]["key"];

export function isMercoCategoryKey(value: string): value is MercoCategoryKey {
  return MERCO_CATEGORIES.some((c) => c.key === value);
}

export function mercoCategoryLabel(key: string): string {
  return MERCO_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

export const CATEGORY_QUERIES: CategoryQueryConfig[] = [
  {
    key: "crm-sales",
    label: "CRM & ventes",
    queries: ["crm saas", "sales crm saas", "multi tenant crm"],
  },
  {
    key: "booking",
    label: "Réservation",
    queries: ["booking saas", "appointment saas", "multi business booking"],
  },
  {
    key: "ecommerce",
    label: "E-commerce",
    queries: ["ecommerce saas", "store builder saas", "marketplace saas"],
  },
  {
    key: "education",
    label: "Éducation",
    queries: ["school saas", "education saas", "lms saas"],
  },
  {
    key: "hr-management",
    label: "RH & gestion",
    queries: ["hrm saas", "erp saas", "payroll saas"],
  },
  {
    key: "website-builder",
    label: "Création de sites",
    queries: ["website builder saas", "multitenant website builder"],
  },
  {
    key: "logistics",
    label: "Logistique",
    queries: ["courier saas", "delivery saas", "logistics saas", "fleet saas"],
  },
  {
    key: "whatsapp-crm",
    label: "WhatsApp & relation client",
    queries: ["whatsapp crm saas", "whatsapp chatbot saas", "messaging crm saas"],
  },
];