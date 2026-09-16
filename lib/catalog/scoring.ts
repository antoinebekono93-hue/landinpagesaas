/**
 * Scoring MERCO (0–100) — aide interne, JAMAIS une preuve de licence.
 *
 * Honnêteté : un prix élevé ne signifie PAS une meilleure qualité et ne donne
 * aucun bonus direct. Le score est utilisé pour classer les candidats (Top 5)
 * et orienter l'audit manuel.
 */

export type ScoreInput = {
  title: string;
  description?: string;
  updatedAt?: string | Date | null;
  sales?: number | null;
  rating?: number | null;
  ratingCount?: number | null;
  previewUrl?: string | null;
  multiTenantStatus?: string | null;
};

export type ScoreBucketKey = "excellent" | "good" | "audit" | "low";

export type ScoreBucket = {
  key: ScoreBucketKey;
  label: string;
};

const RECENT_DAYS = 365;
const OLD_DAYS = 730;

function daysSince(input: string | Date | null): number | null {
  if (!input) return null;
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return null;
  const ms = Date.now() - date.getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}

function clamp(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function hasSaaSIndicators(text: string): boolean {
  return /\bsaas\b/.test(text);
}

function hasTenantIndicators(text: string): boolean {
  return /multi[-\s]?tenant|multitenanc|subscri(ption|bable)|super\s*admin/.test(
    text
  );
}

export function scoreProduct(input: ScoreInput): number {
  const text = `${input.title} ${input.description ?? ""}`.toLowerCase();
  let score = 0;

  // +20 titre / description contient « SaaS »
  if (hasSaaSIndicators(text)) score += 20;

  // +20 multi-tenant / multitenant détecté (texte ou statut)
  const multiTenant =
    input.multiTenantStatus === "true" ||
    input.multiTenantStatus === "needs-audit" ||
    hasTenantIndicators(text);
  if (multiTenant) score += 20;

  // +10 subscription / tenant / super admin
  if (hasTenantIndicators(text)) score += 10;

  const days = daysSince(input.updatedAt ?? null);
  // +15 mise à jour récente
  if (days !== null && days <= RECENT_DAYS) score += 15;
  // Malus : dernière mise à jour très ancienne
  if (days !== null && days > OLD_DAYS) score -= 20;

  // +15 ventes importantes (décroissant)
  const sales = input.sales ?? 0;
  if (sales >= 500) score += 15;
  else if (sales >= 100) score += 10;
  else if (sales > 0) score += 5;

  // +10 bonne note
  const rating = input.rating ?? 0;
  if (rating >= 4.5) score += 10;
  else if (rating >= 4) score += 5;

  // +5 nombre suffisant de reviews
  const ratingCount = input.ratingCount ?? 0;
  if (ratingCount >= 100) score += 5;
  else if (ratingCount >= 20) score += 2;

  // +5 preview officielle disponible
  if (input.previewUrl) score += 5;

  // Malus : peu de ventes ET produit ancien
  if (days !== null && days > OLD_DAYS && sales > 0 && sales < 50) score -= 20;

  // Malus : aucun indice SaaS / multi-tenant
  if (!hasSaaSIndicators(text) && !multiTenant) score -= 30;

  return clamp(score);
}

export function scoreBucket(score: number): ScoreBucket {
  if (score >= 80)
    return { key: "excellent", label: "Excellent candidat" };
  if (score >= 65) return { key: "good", label: "Bon candidat" };
  if (score >= 50) return { key: "audit", label: "À auditer" };
  return { key: "low", label: "Faible priorité" };
}

export function scoreBucketKey(score: number): ScoreBucketKey {
  return scoreBucket(score).key;
}