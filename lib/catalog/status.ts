/**
 * Statuts MERCO, badges publics et condition d'activation commerciale.
 *
 * Règle d'or : le scoring et la synchronisation Envato ne peuvent JAMAIS
 * mettre un produit au statut `active` ni passer les flags MERCO à true.
 * Seule une validation manuelle depuis l'admin le permet.
 */

export const PRODUCT_STATUSES = [
  "research",
  "review",
  "technical_review",
  "license_review",
  "active",
  "rejected",
  "archived",
  "source_unavailable",
] as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export type PublicStatusBadge = {
  label: string;
  /** Un badge "info" est à l'étude, "warn" alerte, "ok" disponible. */
  tone: "info" | "warn" | "ok";
};

export const STATUS_BADGES: Record<ProductStatus, PublicStatusBadge> = {
  research: { label: "À l'étude", tone: "info" },
  review: { label: "Sélection MERCO", tone: "info" },
  technical_review: { label: "Audit technique", tone: "warn" },
  license_review: { label: "Licence en vérification", tone: "warn" },
  active: { label: "Disponible avec MERCO", tone: "ok" },
  source_unavailable: { label: "Source à confirmer", tone: "warn" },
  rejected: { label: "Non retenu", tone: "warn" },
  archived: { label: "Archivé", tone: "warn" },
};

export function statusBadge(status: string): PublicStatusBadge {
  return STATUS_BADGES[status as ProductStatus] ?? {
    label: "À l'étude",
    tone: "info" as const,
  };
}

/** Statuts affichés publiquement par défaut (rejetés/archivés exclus). */
export function isPubliclyListedStatus(status: string): boolean {
  return status !== "rejected" && status !== "archived";
}

/** Statuts pris en compte pour le top « Sélection MERCO ». */
export function isSelectionCandidate(status: string): boolean {
  return [
    "research",
    "review",
    "technical_review",
    "license_review",
    "active",
  ].includes(status);
}

/**
 * CONDITION D'ACTIVATION — unique point de vérité.
 * Ne retourne true que si TOUTES les conditions MERCO manuelles sont réunies.
 */
export function isCommerciallyAvailable(product: {
  status: string;
  saas_candidate: boolean;
  license_verified: boolean;
  technically_verified: boolean;
  commercially_available: boolean;
}): boolean {
  return (
    product.status === "active" &&
    product.saas_candidate === true &&
    product.license_verified === true &&
    product.technically_verified === true &&
    product.commercially_available === true
  );
}

/** Variante pour les vues publiques (camelCase). */
export function isCommerciallyAvailableView(product: {
  status: string;
  saasCandidate: boolean;
  licenseVerified: boolean;
  technicallyVerified: boolean;
  commerciallyAvailable: boolean;
}): boolean {
  return (
    product.status === "active" &&
    product.saasCandidate === true &&
    product.licenseVerified === true &&
    product.technicallyVerified === true &&
    product.commerciallyAvailable === true
  );
}