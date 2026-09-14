import { heroContent } from "@/lib/content";
import { PRICE_TEXT } from "@/lib/constants";
import { LibraryMockup } from "./LibraryMockup";
import { WhatsAppButton } from "./WhatsAppButton";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-48 left-1/3 h-[30rem] w-[36rem] rounded-full bg-accent/[0.07] blur-3xl" />
        <div className="absolute -right-24 top-24 h-[22rem] w-[22rem] rounded-full bg-saas/[0.06] blur-3xl" />
      </div>

      <div className="container-page pt-14 pb-20 sm:pt-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-line-soft bg-surface px-4 py-1.5 text-xs font-medium text-muted">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              {heroContent.badge}
            </span>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl xl:text-5xl">
              Vous voulez lancer un{" "}
              <span className="text-saas">SaaS</span> sans tout développer de
              zéro ?
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted lg:mx-0">
              {heroContent.subtitle}
            </p>

            <div className="mt-7">
              <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {PRICE_TEXT}
              </p>
              <p className="mt-1.5 text-sm text-muted">{heroContent.priceLine}</p>
            </div>

            <div className="mx-auto mt-8 max-w-md sm:max-w-none">
              <WhatsAppButton location="hero" size="lg" fullWidth>
                {heroContent.cta}
              </WhatsAppButton>
            </div>
            <p className="mt-4 text-sm text-muted">{heroContent.ctaNote}</p>
            <p className="mt-1.5 text-sm text-muted">
              {heroContent.reassurance}
            </p>
          </div>

          <LibraryMockup badge={heroContent.libraryBadge} />
        </div>
      </div>
    </section>
  );
}