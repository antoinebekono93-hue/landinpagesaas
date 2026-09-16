import {
  PLAN_PRO,
  PLAN_STARTER,
  WHATSAPP_LINK_PRO,
  WHATSAPP_LINK_STARTER,
} from "@/lib/constants";
import { IconCheck } from "./icons";
import { PlanCta } from "./PlanCta";
import { PlanViewTracker } from "./PlanViewTracker";

function PlanCard({
  plan,
  highlighted = false,
}: {
  plan: typeof PLAN_STARTER | typeof PLAN_PRO;
  highlighted?: boolean;
}) {
  const link = plan.id === "starter" ? WHATSAPP_LINK_STARTER : WHATSAPP_LINK_PRO;

  return (
    <article
      className={`relative flex flex-col rounded-2xl border p-8 ${
        highlighted
          ? "border-accent/50 bg-gradient-to-b from-surface to-surface/[0.5] shadow-2xl shadow-accent/[0.08] lg:-translate-y-2"
          : "border-line bg-surface"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold uppercase tracking-wide text-white">
          {plan.name}
        </h3>
        {plan.badge ? (
          <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-950">
            {plan.badge}
          </span>
        ) : null}
      </div>

      <p className="mt-4 text-4xl font-bold tracking-tight text-white">
        {plan.price}
        <span className="text-lg font-semibold text-muted"> {plan.priceDetail}</span>
      </p>
      <p className="mt-1.5 text-sm font-medium text-saas">{plan.promise}</p>

      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-sm text-slate-200"
          >
            <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-7">
        <PlanCta
          plan={plan.id}
          label={plan.cta}
          link={link}
          location={`pricing_${plan.id}`}
          variant={highlighted ? "primary" : "outline"}
        />
        <p className="mt-3 text-center text-xs text-muted">
          Paiement mensuel selon les modalités MERCO
        </p>
      </div>
    </article>
  );
}

export function BusinessPricing() {
  return (
    <section id="tarifs" className="section-pad border-t border-line">
      <div className="container-page">
        <PlanViewTracker />
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Offres Business</p>
          <h2 className="section-title">
            Choisissez combien de business vous voulez lancer
          </h2>
          <p className="mt-4 text-muted">
            Commencez petit ou construisez un portefeuille de plusieurs SaaS.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 lg:grid-cols-2">
          <PlanCard plan={PLAN_STARTER} />
          <PlanCard plan={PLAN_PRO} highlighted />
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted">
          Vous pouvez commencer avec Starter puis passer à Pro lorsque vous
          souhaitez ajouter davantage de SaaS. L&apos;évolution du plan dépend
          des conditions MERCO en vigueur&nbsp;: confirmez sur WhatsApp avant
          votre souscription.
        </p>
      </div>
    </section>
  );
}