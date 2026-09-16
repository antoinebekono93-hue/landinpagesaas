import {
  EVENT_DEMO_INTENT,
  WHATSAPP_LINK_DEMO,
} from "@/lib/constants";
import { PortfolioMockup } from "./PortfolioMockup";
import { WhatsAppButton } from "./WhatsAppButton";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-48 left-1/3 h-[30rem] w-[36rem] rounded-full bg-accent/[0.08] blur-3xl" />
        <div className="absolute -right-24 top-24 h-[22rem] w-[22rem] rounded-full bg-saas/[0.07] blur-3xl" />
      </div>

      <div className="container-page pt-14 pb-16 sm:pt-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              Votre business SaaS clé en main
            </span>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl xl:text-5xl">
              Lancez votre propre business{" "}
              <span className="text-saas">SaaS</span> sans développer le
              logiciel de zéro.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted lg:mx-0">
              Choisissez vos solutions, MERCO s&apos;occupe de la mise en ligne
              et de l&apos;hébergement. Vous vous concentrez sur votre offre et
              vos clients.
            </p>

            <div className="mt-7">
              <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                À partir de 5 000 FCFA / mois
              </p>
              <p className="mt-1.5 text-sm font-medium text-slate-300">
                2 SaaS avec Starter • 5 SaaS avec Pro
              </p>
            </div>

            <div className="mx-auto mt-8 max-w-md space-y-3 sm:max-w-none sm:flex sm:items-center sm:justify-center sm:space-y-0 sm:gap-3 lg:justify-start">
              <a
                href="#catalogue"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-slate-950 transition-colors hover:bg-[#1fce5e] sm:w-auto"
              >
                Voir les SaaS disponibles
              </a>
              <WhatsAppButton
                location="hero_whatsapp"
                link={WHATSAPP_LINK_DEMO}
                event={EVENT_DEMO_INTENT}
                variant="outline"
                size="lg"
                fullWidth
              >
                Parler à MERCO sur WhatsApp
              </WhatsAppButton>
            </div>

            <p className="mt-4 text-sm font-medium text-slate-200">
              Pas besoin d&apos;être développeur.
            </p>
            <p className="mt-1 text-xs text-muted/80">
              Vous choisissez. MERCO déploie. Vous lancez.
            </p>
          </div>

          <PortfolioMockup />
        </div>
      </div>
    </section>
  );
}