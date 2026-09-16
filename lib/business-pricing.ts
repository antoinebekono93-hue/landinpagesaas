export type BusinessPlanId = "starter" | "pro";

export interface BusinessPlan {
  id: BusinessPlanId;
  name: string;
  badge: string | null;
  launchBadge: string;
  currency: "USD";
  introductoryMonthlyPrice: number;
  regularMonthlyPrice: number;
  introductoryMonths: number;
  saasLimit: number;
  promise: string;
  cta: string;
  features: string[];
}

export const STARTER: BusinessPlan = {
  id: "starter",
  name: "Business Starter",
  badge: null,
  launchBadge: "Prix de lancement",
  currency: "USD",
  introductoryMonthlyPrice: 9,
  regularMonthlyPrice: 45,
  introductoryMonths: 12,
  saasLimit: 2,
  promise: "Jusqu'à 2 SaaS actifs",
  cta: "Démarrer à 9 $/mois",
  features: [
    "Jusqu'à 2 SaaS actifs",
    "Hébergement inclus selon les limites du plan",
    "SSL",
    "Maintenance technique de base",
    "Accès administrateur selon la solution",
    "Orientation MERCO",
    "Possibilité de remplacer un SaaS selon les conditions MERCO",
    "Support WhatsApp",
  ],
};

export const PRO: BusinessPlan = {
  id: "pro",
  name: "Business Pro",
  badge: "Le plus populaire",
  launchBadge: "Prix de lancement",
  currency: "USD",
  introductoryMonthlyPrice: 18,
  regularMonthlyPrice: 65,
  introductoryMonths: 12,
  saasLimit: 5,
  promise: "Jusqu'à 5 SaaS actifs",
  cta: "Démarrer à 18 $/mois",
  features: [
    "Jusqu'à 5 SaaS actifs",
    "Hébergement inclus selon les limites du plan",
    "SSL",
    "Maintenance technique de base",
    "Accès administrateur selon la solution",
    "Orientation MERCO",
    "Possibilité de construire un portefeuille de plusieurs services",
    "Support WhatsApp",
  ],
};

export const PLANS = [STARTER, PRO] as const;

export function businessPlanById(id: BusinessPlanId): BusinessPlan {
  return id === "starter" ? STARTER : PRO;
}

export function priceLabel(value: number): string {
  return `${value} $`;
}

export function monthlyPrice(value: number): string {
  return `${value} $/mois`;
}

export function firstYearTotal(plan: BusinessPlan): number {
  return plan.introductoryMonthlyPrice * 12;
}

export function regularYearTotal(plan: BusinessPlan): number {
  return plan.regularMonthlyPrice * 12;
}

export function yearlySavings(plan: BusinessPlan): number {
  return regularYearTotal(plan) - firstYearTotal(plan);
}

export function savingsPercent(plan: BusinessPlan): number {
  return Math.round((yearlySavings(plan) / regularYearTotal(plan)) * 100);
}

export function regularStartMonth(plan: BusinessPlan): number {
  return plan.introductoryMonths + 1;
}