import { businessFaqs } from "@/lib/content";

interface FAQProps {
  items?: { q: string; a: string }[];
}

export function FAQ({ items = businessFaqs }: FAQProps) {
  return (
    <section id="faq" className="section-pad border-t border-line bg-surface/[0.35]">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Questions fréquentes</p>
          <h2 className="section-title">FAQ</h2>
        </div>

        <div className="mx-auto mt-10 max-w-2xl space-y-3">
          {items.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border border-line bg-surface open:border-accent/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-white [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line-soft text-muted transition-transform group-open:rotate-45"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3 w-3">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-muted">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}