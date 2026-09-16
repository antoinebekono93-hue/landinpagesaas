import { WHATSAPP_NUMBER } from "@/lib/constants";

/**
 * CTA produit : messages WhatsApp officiels.
 * Le CTA « Choisir ce SaaS » n'est affiché que si `isCommerciallyAvailable`.
 */

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Produit non encore actif → « Demander sa vérification ». */
export function productVerificationMessage(productName: string): string {
  return `Bonjour MERCO 👋 Je suis intéressé par ${productName}. Pouvez-vous vérifier sa disponibilité avec MERCO Business ?`;
}

export function productVerificationLink(productName: string): string {
  return waLink(productVerificationMessage(productName));
}

/** Produit actif → « Choisir ce SaaS ». */
export function productSelectMessage(productName: string): string {
  return `Bonjour MERCO 👋 Je souhaite ajouter ${productName} à mon plan MERCO Business.`;
}

export function productSelectLink(productName: string): string {
  return waLink(productSelectMessage(productName));
}