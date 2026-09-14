import { heroContent } from "@/lib/content";

interface LibraryMockupProps {
  badge?: string;
  compact?: boolean;
  className?: string;
  categories?: string[];
}

export function LibraryMockup({
  badge,
  compact = false,
  className = "",
  categories = heroContent.categories,
}: LibraryMockupProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line-soft" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-soft/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent/50" />
          </span>
          <span className="text-[11px] font-medium text-muted">
            Bibliothèque MERCO
          </span>
        </div>

        <div className={compact ? "p-4" : "p-4 sm:p-5"}>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted">
            Catégories
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-line-soft bg-surface-2 px-3 py-1.5 text-xs font-medium text-slate-200"
              >
                {category}
              </span>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            {["Solution SaaS", "Application mobile", "Script PHP"].map(
              (label) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-lg border border-line bg-surface-2/60 px-3.5 py-2.5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
                    <IconFolder className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1 truncate text-xs font-medium text-slate-200">
                    {label}
                  </span>
                  <span aria-hidden="true" className="shrink-0 text-muted">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {badge ? (
        <div className="absolute -bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-accent/40 bg-background px-4 py-2 text-xs font-medium text-accent shadow-xl">
          {badge}
        </div>
      ) : null}
    </div>
  );
}

function IconFolder({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}