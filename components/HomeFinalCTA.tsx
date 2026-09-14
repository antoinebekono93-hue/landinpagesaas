import { WHATSAPP_LINK_HOME } from "@/lib/constants";
import { WhatsAppButton } from "./WhatsAppButton";

export function HomeFinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[24rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.08] blur-3xl" />
      </div>

      <div className="container-page py-20 text-center sm:py-24">
        <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Quel projet voulez-vous lancer ?
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
          Expliquez votre besoin à MERCO et découvrez les solutions qui
          pourraient vous aider à avancer plus vite.
        </p>
        <div className="mx-auto mt-8 max-w-md space-y-3 sm:max-w-none sm:flex sm:items-center sm:justify-center sm:space-y-0 sm:gap-3">
          <WhatsAppButton
            location="final_cta"
            link={WHATSAPP_LINK_HOME}
            size="lg"
            fullWidth
          >
            Parler à MERCO sur WhatsApp
          </WhatsAppButton>
          <a
            href="#demo"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-line-soft bg-surface px-7 py-3.5 text-base font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white sm:w-auto"
          >
            Voir la démonstration
          </a>
        </div>
      </div>
    </section>
  );
}