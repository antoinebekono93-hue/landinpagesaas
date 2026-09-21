interface SourceHistoryProps {
  rating: number | null;
  ratingCount: number | null;
  salesCount: number | null;
  regularPriceUsd: number | null;
  extendedPriceUsd: number | null;
  updatedAtEnvato: string | null;
  sourceVerified: boolean;
  publishedAt: string | null;
  hasPreview: boolean;
}

function formatUsd(value: number | null): string | null {
  return value === null ? null : `${value} $`;
}

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function SourceHistoryCard({
  rating,
  ratingCount,
  salesCount,
  regularPriceUsd,
  extendedPriceUsd,
  updatedAtEnvato,
  sourceVerified,
  publishedAt,
  hasPreview,
}: SourceHistoryProps) {
  const rows: { label: string; value: string | null }[] = [
    {
      label: "Note source",
      value:
        rating !== null
          ? `${rating} / 5${ratingCount !== null ? ` (${ratingCount} avis)` : ""}`
          : null,
    },
    {
      label: "Ventes observées",
      value: salesCount !== null ? String(salesCount) : null,
    },
    {
      label: "Prix source",
      value: formatUsd(regularPriceUsd),
    },
    {
      label: "Prix source étendu",
      value: formatUsd(extendedPriceUsd),
    },
    {
      label: "Mis à jour sur la source",
      value: formatDate(updatedAtEnvato),
    },
    {
      label: "Publié le",
      value: formatDate(publishedAt),
    },
    {
      label: "Aperçu officiel",
      value: hasPreview ? "Disponible" : null,
    },
  ];

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
            sourceVerified
              ? "border-accent/30 bg-accent/10 text-accent"
              : "border-warn/30 bg-warn/10 text-warn-soft"
          }`}
        >
          {sourceVerified ? "Source vérifiée" : "Source à confirmer"}
        </span>
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        {rows
          .filter((row) => row.value !== null)
          .map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-3">
              <dt className="text-muted">{row.label}</dt>
              <dd className="text-right text-slate-100">{row.value}</dd>
            </div>
          ))}
      </dl>

      <p className="mt-4 border-t border-line-soft pt-3 text-xs leading-relaxed text-muted">
        Ces données proviennent de la source officielle (Envato Market). Le prix
        affiché ne constitue pas le tarif de l&apos;abonnement MERCO.
      </p>
    </div>
  );
}