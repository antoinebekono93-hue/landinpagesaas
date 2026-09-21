import { scoreBucket } from "@/lib/catalog/scoring";

interface ScoreRingProps {
  score: number;
  size?: number;
}

const SIZE = 64;
const STROKE = 6;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function toneForScore(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 65) return "#38bdf8";
  if (score >= 50) return "#f59e0b";
  return "#64748b";
}

export function ScoreRing({ score, size = SIZE }: ScoreRingProps) {
  const safe = Math.min(100, Math.max(0, score));
  const offset = CIRCUMFERENCE - (safe / 100) * CIRCUMFERENCE;
  const tone = toneForScore(safe);
  const bucket = scoreBucket(safe);

  return (
    <div className="flex items-center gap-4">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={`Score MERCO ${safe}/100`}
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--color-line-soft)"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={tone}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fill="currentColor"
          style={{ fontSize: 17, fontWeight: 700 }}
        >
          {safe}
        </text>
      </svg>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Score MERCO
        </p>
        <p className="text-sm font-medium text-white">{bucket.label}</p>
      </div>
    </div>
  );
}