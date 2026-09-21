import { ConfidenceTag, type ConfidenceLevel } from "./ConfidenceTag";

export type WhiteLabelState =
  | { status: "available"; label: string; detail: string; confidence: ConfidenceLevel }
  | { status: "unconfirmed"; label: string; detail: string; confidence: ConfidenceLevel }
  | { status: "unavailable"; label: string; detail: string; confidence: ConfidenceLevel };

/**
 * Calcule l'état marque blanche à partir de LA VRAIE valeur du système.
 *
 * Valeurs réellement produites par le sync Envato : "needs-audit", "unknown".
 * L'admin peut aussi renseigner librement le champ (ex : "true", "false").
 *
 * Règle : l'absence de preuve ("unknown" / non renseigné) est "Non confirmé",
 * jamais "Non disponible".
 */
export function whiteLabelState(whiteLabelStatus: string | null): WhiteLabelState {
  const value = (whiteLabelStatus ?? "").trim().toLowerCase();

  if (value === "true") {
    return {
      status: "available",
      label: "Disponible",
      detail: "La marque blanche est confirmée : le produit peut être revendu sous votre propre marque.",
      confidence: "merco",
    };
  }
  if (value === "false") {
    return {
      status: "unavailable",
      label: "Non disponible",
      detail: "La marque blanche n'est pas proposée pour ce produit.",
      confidence: "merco",
    };
  }
  if (value === "needs-audit") {
    return {
      status: "unconfirmed",
      label: "Non confirmé",
      detail: "Des indices de marque blanche ont été détectés sur la source mais ne sont pas encore vérifiés par MERCO.",
      confidence: "unverified",
    };
  }
  if (value === "unknown" || value === "") {
    return {
      status: "unconfirmed",
      label: "Non confirmé",
      detail: "Aucune information de marque blanche n'est renseignée. L'absence de preuve n'est pas une preuve d'indisponibilité.",
      confidence: "unverified",
    };
  }

  return {
    status: "unconfirmed",
    label: "Non confirmé",
    detail: "Le statut marque blanche n'est pas documenté pour ce produit.",
    confidence: "unverified",
  };
}

const DOT_TONES: Record<"available" | "unconfirmed" | "unavailable", string> = {
  available: "bg-accent",
  unconfirmed: "bg-warn",
  unavailable: "bg-muted",
};

const TEXT_TONES: Record<"available" | "unconfirmed" | "unavailable", string> = {
  available: "text-white",
  unconfirmed: "text-warn-soft",
  unavailable: "text-muted",
};

interface WhiteLabelCardProps {
  whiteLabelStatus: string | null;
}

export function WhiteLabelCard({ whiteLabelStatus }: WhiteLabelCardProps) {
  const state = whiteLabelState(whiteLabelStatus);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-white">Marque blanche</h2>
        <ConfidenceTag level={state.confidence} />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`h-2 w-2 rounded-full ${DOT_TONES[state.status]}`}
        />
        <p className={`text-sm font-semibold ${TEXT_TONES[state.status]}`}>
          {state.label}
        </p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">{state.detail}</p>
    </div>
  );
}