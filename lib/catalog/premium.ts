import "server-only";

/**
 * Entitlement MERCO Premium.
 *
 * Contrat : un seul abonnement actif débloque TOUTES les ressources Premium
 * actives du catalogue. Pas d'achat par produit, pas de grant par fichier.
 *
 * Aucun backend de facturation/subscription n'existe encore dans ce dépôt
 * (audit phase marketplace). On ne fabriQUe aucun entitlement : la valeur
 * retournée reflète l'état réellement disponible.
 *
 * Quand le paiement réel sera branché (Stripe/Nhost ou équivalent), c'est ici
 * que la requête vers le backend d'abonnement devra être implémentée.
 */

export type PremiumEntitlement = {
  isPremium: boolean;
  /** Raison de l'état : `no-billing-backend` ou `subscription-inactive`. */
  reason: "no-billing-backend" | "subscription-inactive" | "active";
};

/**
 * Retourne l'état réel de l'abonnement Premium d'un utilisateur.
 * @param userId Identifiant Nhost de l'utilisateur connecté, ou null si anonyme.
 */
export async function getPremiumEntitlement(
  userId: string | null
): Promise<PremiumEntitlement> {
  if (!userId) {
    return { isPremium: false, reason: "subscription-inactive" };
  }
  // Aucun backend de facturation n'existe : on ne peut pas confirmer un
  // abonnement payant. L'état honnête est « non-Premium ».
  return { isPremium: false, reason: "no-billing-backend" };
}