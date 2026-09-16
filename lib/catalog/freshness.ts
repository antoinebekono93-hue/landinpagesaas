/**
 * Fraîcheur des données Envato.
 * Les données issues de l'API Envato ne doivent pas être présentées comme
 * actuelles si elles datent de plus de 6 heures.
 */

export const ENVATO_FRESHNESS_MS = 6 * 60 * 60 * 1000;

export function isEnvatoDataFresh(lastSyncedAt: string | Date | null): boolean {
  if (!lastSyncedAt) return false;
  const date = typeof lastSyncedAt === "string" ? new Date(lastSyncedAt) : lastSyncedAt;
  if (Number.isNaN(date.getTime())) return false;
  return Date.now() - date.getTime() <= ENVATO_FRESHNESS_MS;
}

/** Libellé « Dernière synchronisation Envato : … » (locale fr). */
export function lastSyncedLabel(lastSyncedAt: string | Date | null): string {
  if (!lastSyncedAt) return "Dernière synchronisation Envato : jamais.";
  const date = typeof lastSyncedAt === "string" ? new Date(lastSyncedAt) : lastSyncedAt;
  if (Number.isNaN(date.getTime())) {
    return "Dernière synchronisation Envato : inconnue.";
  }
  const formatted = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
  return `Dernière synchronisation Envato : ${formatted}.`;
}