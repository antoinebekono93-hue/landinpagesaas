export const WHATSAPP_LOCATIONS = [
  "header",
  "hero_catalog",
  "hero_whatsapp",
  "steps",
  "catalog_category",
  "catalog_card",
  "catalog_empty",
  "demo",
  "comparison",
  "business_model",
  "api_costs",
  "hosting",
  "trust",
  "pricing_starter",
  "pricing_pro",
  "pricing_info",
  "library_alternative",
  "final_cta",
  "sticky_mobile",
  "home_hero_demo",
  "home_intent",
] as const;

export type WhatsAppLocation = (typeof WHATSAPP_LOCATIONS)[number];

export const heroContent = {
  badge: "Pour entrepreneurs, développeurs & créateurs de SaaS",
  title: "Ne repartez pas de zéro pour lancer votre SaaS.",
  subtitle:
    "Découvrez des applications, scripts et bases numériques pouvant accélérer votre projet. MERCO vous aide à identifier la solution adaptée.",
  priceLine: "Paiement unique • Accès à vie",
  ctaPrimary: "Voir la démo avant de payer",
  ctaSecondary: "Activer mon accès — 10 000 FCFA",
  ctaNote: "Vous voyez d'abord. Vous décidez ensuite.",
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

export const businessFaqs = [
  {
    q: "Dois-je savoir coder ?",
    a: "Non. Avec l'offre Business, MERCO s'occupe de la mise en ligne et de la partie technique prévue dans votre abonnement. Vous choisissez vos solutions et vous vous concentrez sur vos clients.",
  },
  {
    q: "Que signifie 2 SaaS actifs ?",
    a: "Le plan Starter vous permet d'avoir jusqu'à 2 solutions SaaS actives en même temps dans votre hébergement, selon les limites du plan.",
  },
  {
    q: "Que signifie 5 SaaS actifs ?",
    a: "Le plan Pro vous permet d'avoir jusqu'à 5 solutions SaaS actives en même temps, pour construire un portefeuille de plusieurs services.",
  },
  {
    q: "L'hébergement est-il inclus ?",
    a: "L'hébergement est inclus selon les ressources et limites du plan. Les détails précis (CPU, RAM, stockage, trafic) seront communiqués selon l'offre en vigueur.",
  },
  {
    q: "Puis-je utiliser mon propre domaine ?",
    a: "Selon la solution et les conditions du plan. La question du domaine doit être confirmée avec MERCO avant ou pendant la mise en ligne de votre SaaS.",
  },
  {
    q: "Puis-je changer de SaaS plus tard ?",
    a: "La possibilité de remplacer un SaaS dépend des conditions MERCO du plan. Contactez-nous sur WhatsApp pour vérifier la faisabilité selon votre situation.",
  },
  {
    q: "Les API externes sont-elles comprises ?",
    a: "Non, pas toujours. Les API tierces telles que IA, WhatsApp, SMS, e-mail, téléphonie ou paiement ne sont pas nécessairement incluses. Selon la solution, vous pouvez connecter vos propres clés API ou payer votre consommation.",
  },
  {
    q: "Puis-je fixer mes propres prix à mes clients ?",
    a: "Oui. Vous définissez votre propre offre commerciale et cherchez vos propres clients, selon les conditions d'utilisation de chaque solution.",
  },
  {
    q: "Qui s'occupe de la maintenance ?",
    a: "La maintenance technique de base est incluse dans les plans Business. Les interventions plus profondes ou spécifiques peuvent faire l'objet d'un échange préalable avec MERCO.",
  },
  {
    q: "Puis-je revendre le code source ?",
    a: "Non. MERCO sélectionne pour l'offre Business uniquement des solutions dont l'utilisation hébergée a été vérifiée pour le modèle proposé. Les droits exacts peuvent varier selon chaque solution : vous achetez principalement un accès hébergé et le service MERCO.",
  },
  {
    q: "Quelle différence entre MERCO Business et l'accès bibliothèque à vie ?",
    a: "Business est un abonnement mensuel où MERCO met en ligne et maintient vos SaaS (2 avec Starter, 5 avec Pro). L'accès bibliothèque à vie est une offre secondaire pour les développeurs qui préfèrent gérer eux-mêmes leurs projets.",
  },
  {
    q: "MERCO garantit-il des revenus ?",
    a: "Non. MERCO ne garantit aucun revenu ni nombre de clients. Votre revenu dépend de votre offre, de vos clients et de votre marché.",
  },
];

export type BusinessCategoryId =
  | "crm"
  | "reservation"
  | "ecommerce"
  | "education"
  | "rh"
  | "sites"
  | "logistique"
  | "whatsapp";

export interface BusinessCategory {
  id: BusinessCategoryId;
  title: string;
  description: string;
  useCases: string[];
  icon: string;
}

export const businessCatalogs: BusinessCategory[] = [
  {
    id: "crm",
    title: "CRM & ventes",
    description: "Proposez un logiciel de gestion clients aux PME, agences ou commerciaux.",
    useCases: ["Suivi clients", "Relances automatiques", "Tableaux de bord ventes"],
    icon: "users",
  },
  {
    id: "reservation",
    title: "Réservation",
    description: "Lancez un service de réservation pour salons, consultants, garages, coachs ou services.",
    useCases: ["Prise de rendez-vous", "Agenda en ligne", "Confirmation client"],
    icon: "calendar",
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    description: "Proposez une plateforme permettant aux commerçants de créer ou gérer leur activité en ligne.",
    useCases: ["Boutique en ligne", "Catalogue produits", "Gestion des commandes"],
    icon: "cart",
  },
  {
    id: "education",
    title: "Éducation",
    description: "Lancez une solution destinée aux écoles, centres de formation ou établissements.",
    useCases: ["Gestion des élèves", "Cours en ligne", "Suivi des paiements"],
    icon: "graduation",
  },
  {
    id: "rh",
    title: "RH & gestion",
    description: "Proposez des outils RH, paie, présence ou gestion interne aux entreprises.",
    useCases: ["Gestion du personnel", "Pointage", "Suivi des congés"],
    icon: "building",
  },
  {
    id: "sites",
    title: "Création de sites",
    description: "Lancez votre propre service de création de sites ou pages professionnelles.",
    useCases: ["Sites vitrines", "Pages professionnelles", "Sites pour commerces"],
    icon: "code",
  },
  {
    id: "logistique",
    title: "Logistique",
    description: "Proposez un logiciel de gestion pour sociétés de livraison et transport.",
    useCases: ["Suivi des livraisons", "Gestion des coursiers", "Statistiques"],
    icon: "truck",
  },
  {
    id: "whatsapp",
    title: "WhatsApp & relation client",
    description: "Proposez des outils de support, CRM et automatisation conversationnelle.",
    useCases: ["Support client", "Réponses automatiques", "Suivi des conversations"],
    icon: "chat",
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