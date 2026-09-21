export type ConfidenceLevel = "merco" | "source" | "unverified";

const TONES: Record<ConfidenceLevel, string> = {
  merco: "border-accent/30 bg-accent/10 text-accent",
  source: "border-saas/30 bg-saas/10 text-saas",
  unverified: "border-warn/30 bg-warn/10 text-warn-soft",
};

const LABELS: Record<ConfidenceLevel, string> = {
  merco: "Vérifié par MERCO",
  source: "Déclaré par la source",
  unverified: "Non vérifié",
};

interface ConfidenceTagProps {
  level: ConfidenceLevel;
  className?: string;
}

export function ConfidenceTag({ level, className = "" }: ConfidenceTagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${TONES[level]} ${className}`}
    >
      {LABELS[level]}
    </span>
  );
}