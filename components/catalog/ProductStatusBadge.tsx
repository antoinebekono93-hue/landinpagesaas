import { statusBadge } from "@/lib/catalog/status";

const TONE_CLASSES: Record<string, string> = {
  info: "border-saas/30 bg-saas/10 text-saas",
  warn: "border-warn/30 bg-warn/10 text-warn-soft",
  ok: "border-accent/30 bg-accent/10 text-accent",
};

interface ProductStatusBadgeProps {
  status: string;
  className?: string;
}

export function ProductStatusBadge({
  status,
  className = "",
}: ProductStatusBadgeProps) {
  const badge = statusBadge(status);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${TONE_CLASSES[badge.tone]} ${className}`}
    >
      {badge.label}
    </span>
  );
}