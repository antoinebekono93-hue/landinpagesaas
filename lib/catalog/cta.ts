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

/* ── CTAs services : réellement adressés à MERCO (WhatsApp), sans provisioning fictif ── */

/** Service « Installer » : demande d'intervention réelle. */
export function productInstallMessage(productName: string): string {
  return `Bonjour MERCO 👋 Je souhaite faire installer ${productName} sur mon hébergement (MERCO Business).`;
}

export function productInstallLink(productName: string): string {
  return waLink(productInstallMessage(productName));
}

/** Service « Héberger » : demande d'hébergement réelle. */
export function productHostMessage(productName: string): string {
  return `Bonjour MERCO 👋 Je souhaite héberger ${productName} avec MERCO Business (infrastructure incluse).`;
}

export function productHostLink(productName: string): string {
  return waLink(productHostMessage(productName));
}

/** Service « Lancer » : demande de mise en ligne réelle. */
export function productLaunchMessage(productName: string): string {
  return `Bonjour MERCO 👋 Je souhaite lancer ${productName} en production avec l'accompagnement MERCO Business.`;
}

export function productLaunchLink(productName: string): string {
  return waLink(productLaunchMessage(productName));
}