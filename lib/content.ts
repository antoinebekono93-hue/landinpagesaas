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
  "intent_saas",
  "intent_application",
  "intent_code_source",
  "intent_business",
  "library",
  "transformation",
  "how",
] as const;

export type WhatsAppLocation = (typeof WHATSAPP_LOCATIONS)[number];

export const heroContent = {
  badge: "Pour entrepreneurs, développeurs & créateurs de SaaS",
  title: "Vous voulez lancer un SaaS sans tout développer de zéro ?",
  subtitle:
    "MERCO vous donne accès à vie à une bibliothèque d'applications, scripts et solutions numériques pouvant accélérer votre prochain projet.",
  priceLine: "Paiement unique • Accès à vie",
  cta: "Parler à MERCO sur WhatsApp",
  ctaNote: "Vous pouvez voir la démonstration avant tout paiement.",
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

export const homeContent = {
  badge: "Applications • Scripts • SaaS • Opportunités digitales",
  title:
    "Applications, scripts et solutions SaaS pour lancer vos projets plus vite.",
  subtitle:
    "MERCO vous donne accès à vie à une bibliothèque de ressources numériques et vous aide à trouver les solutions adaptées à vos projets.",
  priceLine: "Paiement unique • Accès à vie",
  cta: "Découvrir MERCO sur WhatsApp",
  ctaSecondary: "Voir la démonstration",
  ctaNote: "Vous pouvez découvrir MERCO avant tout paiement.",
  reassurance: "Pas d'abonnement mensuel.",
  categories: [
    "SaaS",
    "Mobile",
    "Flutter",
    "PHP",
    "CRM",
    "E-commerce",
    "IA",
    "WordPress",
  ],
  libraryBadge: "Bibliothèque organisée par catégories",
  demoAnchor: "#demo",
};

export type IntentKind = "internal" | "whatsapp";

export interface HomeIntent {
  id: string;
  title: string;
  description: string;
  cta: string;
  location: string;
  href: string;
  kind: IntentKind;
}

export const homeIntents: HomeIntent[] = [
  {
    id: "saas",
    title: "Lancer un SaaS",
    description:
      "Trouvez des solutions pouvant servir de base à un logiciel ou service SaaS.",
    cta: "Explorer les solutions SaaS",
    location: "intent_saas",
    href: "/creer-saas",
    kind: "internal",
  },
  {
    id: "application",
    title: "Trouver une application",
    description:
      "Découvrez des applications web et mobiles pour accélérer votre projet.",
    cta: "Voir les applications",
    location: "intent_application",
    href: "",
    kind: "whatsapp",
  },
  {
    id: "code_source",
    title: "Trouver un code source ou script",
    description:
      "Explorez des scripts, projets Flutter, PHP et autres bases techniques.",
    cta: "Voir les ressources développeurs",
    location: "intent_code_source",
    href: "",
    kind: "whatsapp",
  },
  {
    id: "business",
    title: "Trouver une idée de business",
    description:
      "Explorez des opportunités numériques adaptées aux entrepreneurs et porteurs de projets.",
    cta: "Découvrir des opportunités",
    location: "intent_business",
    href: "",
    kind: "whatsapp",
  },
];

export const landingFaqs = [
  {
    q: "C'est vraiment 10 000 FCFA à vie ?",
    a: "Oui. Le tarif actuel de MERCO est un paiement unique de 10 000 FCFA pour un accès à vie, sans abonnement mensuel.",
  },
  {
    q: "Dois-je payer chaque application ?",
    a: "Non. Les 10 000 FCFA correspondent à l'accès MERCO et non à l'achat d'une seule application.",
  },
  {
    q: "Puis-je voir avant de payer ?",
    a: "Oui. Vous pouvez demander une démonstration sur WhatsApp avant de décider.",
  },
  {
    q: "Je ne suis pas développeur. Est-ce pour moi ?",
    a: "Oui. MERCO peut également orienter les entrepreneurs, entreprises et particuliers vers des solutions adaptées à leur projet.",
  },
  {
    q: "Puis-je revendre toutes les applications ?",
    a: "Non. Les droits dépendent de la licence et des conditions propres à chaque ressource. MERCO ne garantit pas un droit universel de revente ou de redistribution.",
  },
  {
    q: "Est-ce que MERCO garantit que mon SaaS sera rentable ?",
    a: "Non. MERCO fournit des ressources, de la veille et de l'orientation. La réussite d'un projet dépend du marché, de l'exécution, du marketing et de nombreux autres facteurs.",
  },
];

export const homeFaqs = [
  {
    q: "C'est vraiment 10 000 FCFA à vie ?",
    a: "Oui. Le tarif actuel est un paiement unique de 10 000 FCFA pour un accès à vie.",
  },
  {
    q: "Dois-je payer chaque application ?",
    a: "Non. Les 10 000 FCFA correspondent à l'accès MERCO, pas à l'achat d'une seule application.",
  },
  {
    q: "Puis-je voir avant de payer ?",
    a: "Oui. Vous pouvez demander une démonstration avant d'activer votre accès.",
  },
  {
    q: "Je ne suis pas développeur. Est-ce pour moi ?",
    a: "Oui. MERCO accompagne aussi les entrepreneurs, entreprises et particuliers souhaitant lancer un projet numérique.",
  },
  {
    q: "Puis-je revendre toutes les applications ?",
    a: "Non. Les droits dépendent de la licence et des conditions propres à chaque ressource.",
  },
  {
    q: "MERCO garantit-il que je vais gagner de l'argent ?",
    a: "Non. MERCO fournit des ressources, de la veille et de l'orientation, mais ne garantit aucun revenu ni résultat financier.",
  },
];