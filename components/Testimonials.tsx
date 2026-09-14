// Prepared for future use. Rendered only when real, verified testimonials exist.
// Not currently displayed anywhere on the page.
interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

const EMPTY = [] as Testimonial[];

export function Testimonials() {
  if (EMPTY.length === 0) return null;

  return (
    <section className="section-pad border-t border-line">
      <div className="container-page">
        <h2 className="section-title text-center">Ils utilisent MERCO</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EMPTY.map((testimonial) => (
            <blockquote key={testimonial.name} className="card p-6">
              <p className="text-sm leading-relaxed text-muted">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <footer className="mt-4 text-sm font-semibold text-white">
                {testimonial.name}
                <span className="font-normal text-muted"> — {testimonial.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}