export interface SaasProduct {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  targetCustomers: string;
  screenshot?: string;
  stack?: string[];
  saasEligible: boolean;
  licenseVerified: boolean;
  multiTenant?: boolean;
  apiCosts?: boolean;
  premium?: boolean;
  status: "active" | "inactive" | "coming_soon";
}

/**
 * Catalogue MERCO Business.
 *
 * Règles :
 * - n'afficher que les entrées vérifiées (saasEligible + licenseVerified + status active).
 * - ne jamais inventer de produit non vérifié.
 * - chaque nouveau SaaS doit être ajouté avec des données réelles.
 */
export const saasCatalog: SaasProduct[] = [];

/** Produits éligibles à l'affichage dans le catalogue commercial. */
export function getVisibleCatalog(): SaasProduct[] {
  return saasCatalog.filter(
    (s) => s.status === "active" && s.saasEligible && s.licenseVerified
  );
}
