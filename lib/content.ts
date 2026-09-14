export const WHATSAPP_LOCATIONS = [
  "hero",
  "header",
  "demo",
  "categories",
  "profiles",
  "problem_solution",
  "trust",
  "pricing",
  "final_cta",
  "sticky_mobile",
] as const;

export type WhatsAppLocation = (typeof WHATSAPP_LOCATIONS)[number];

export const heroContent = {
  badge: "Pour entrepreneurs, développeurs & créateurs de SaaS",
  title: "Vous voulez lancer un SaaS sans tout développer de zéro ?",
  subtitle:
    "MERCO vous donne accès à vie à une bibliothèque d'applications, scripts et solutions numériques pouvant accélérer votre prochain projet.",
  priceLine: "Paiement unique • Accès à vie",
  cta: "Découvrir MERCO sur WhatsApp",
  ctaNote: "💬 Demandez une démonstration avant de décider.",
  reassurance: "Pas d'abonnement mensuel.",
  categories: [
    "SaaS",
    "Flutter",
    "PHP",
    "CRM",
    "E-commerce",
    "IA",
    "WordPress",
    "LMS",
  ],
  libraryBadge: "Bibliothèque régulièrement enrichie",
};