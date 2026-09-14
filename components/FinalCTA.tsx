import { WhatsAppButton } from "./WhatsAppButton";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[24rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.08] blur-3xl" />
      </div>

      <div className="container-page py-20 text-center sm:py-24">
        <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Votre prochain SaaS existe peut-être déjà comme base.
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
          Expliquez-nous ce que vous voulez lancer. MERCO vous aidera à
          identifier le type de solution qui pourrait correspondre à votre
          projet.
        </p>
        <div className="mx-auto mt-8 max-w-md sm:max-w-none sm:flex sm:justify-center">
          <WhatsAppButton location="final_cta" size="lg" fullWidth>
            Expliquer mon projet sur WhatsApp
          </WhatsAppButton>
        </div>
        <p className="mt-4 text-sm text-muted">
          Assistant MERCO disponible pour vous orienter.
        </p>
      </div>
    </section>
  );
}