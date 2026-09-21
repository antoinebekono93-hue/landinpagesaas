"use client";

import { useState } from "react";

const VISIBLE_INITIAL = 8;

interface FeaturesGridProps {
  features: string[];
}

export function FeaturesGrid({ features }: FeaturesGridProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? features : features.slice(0, VISIBLE_INITIAL);
  const hasMore = features.length > VISIBLE_INITIAL;

  return (
    <div className="card p-5">
      <h2 className="text-base font-semibold text-white">
        Fonctionnalités principales
      </h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {visible.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 rounded-lg border border-line-soft bg-surface-2/40 px-3 py-2 text-sm text-slate-200"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border border-accent/40 bg-accent/10 text-[10px] text-accent"
            >
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-4 inline-flex items-center gap-1 rounded-full border border-line-soft px-4 py-2 text-xs font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
        >
          {expanded
            ? "Réduire les fonctionnalités"
            : `Voir toutes les fonctionnalités (${features.length})`}
        </button>
      ) : null}
    </div>
  );
}