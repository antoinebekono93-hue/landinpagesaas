import {
  PLAN_PRO,
  PLAN_STARTER,
  WHATSAPP_LINK_PRO,
  WHATSAPP_LINK_STARTER,
} from "@/lib/constants";
import { PlanCta } from "./PlanCta";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[24rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.08] blur-3xl" />
      </div>

      <div className="container-page py-20 text-center sm:py-24">
        <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Prêt à lancer votre business SaaS ?
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
          Choisissez votre plan et commencez à sélectionner vos SaaS. MERCO
          s&apos;occupe de la mise en ligne.
        </p>
        <div className="mx-auto mt-8 flex max-w-md flex-col justify-center gap-3 sm:max-w-none sm:flex-row">
          <PlanCta
            plan={PLAN_STARTER.id}
            label={PLAN_STARTER.cta}
            link={WHATSAPP_LINK_STARTER}
            location="final_starter"
            variant="outline"
          />
          <PlanCta
            plan={PLAN_PRO.id}
            label={PLAN_PRO.cta}
            link={WHATSAPP_LINK_PRO}
            location="final_pro"
          />
        </div>
        <p className="mt-4 text-xs text-muted">
          Paiement mensuel • Vous pouvez demander une démonstration avant de
          souscrire.
        </p>
      </div>
    </section>
  );
}