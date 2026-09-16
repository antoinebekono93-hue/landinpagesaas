import { PRO, STARTER, type BusinessPlan } from "@/lib/business-pricing";
import {
  firstYearTotal,
  monthlyPrice,
  priceLabel,
  regularStartMonth,
  regularYearTotal,
  yearlySavings,
} from "@/lib/business-pricing";
import { WHATSAPP_LINK_PRO, WHATSAPP_LINK_STARTER } from "@/lib/constants";
import { IconCheck } from "./icons";
import { PlanCta } from "./PlanCta";
import { PlanViewTracker } from "./PlanViewTracker";

function PlanCard({
  plan,
  highlighted = false,
}: {
  plan: BusinessPlan;
  highlighted?: boolean;
}) {
  const link = plan.id === "starter" ? WHATSAPP_LINK_STARTER : WHATSAPP_LINK_PRO;
  const launchMonth = regularStartMonth(plan);

  return (
    <article
      className={`relative flex flex-col rounded-2xl border p-7 sm:p-8 ${
        highlighted
          ? "border-accent/50 bg-gradient-to-b from-surface to-surface/[0.5] shadow-2xl shadow-accent/[0.08] lg:-translate-y-2"
          : "border-line bg-surface"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold uppercase tracking-wide text-white">
          {plan.name}
        </h3>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {plan.badge ? (
            <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-950">
              {plan.badge}
            </span>
          ) : null}
          <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-accent">
            {plan.launchBadge}
          </span>
        </div>
      </div>

      <p className="mt-5 text-sm font-semibold text-muted line-through">
        {monthlyPrice(plan.regularMonthlyPrice)}
      </p>
      <p className="mt-1 text-4xl font-bold tracking-tight text-white sm:text-5xl">
        {plan.introductoryMonthlyPrice} $
        <span className="text-lg font-semibold text-muted">/mois</span>
      </p>
      <p className="mt-1.5 text-sm font-semibold text-saas">
        pendant vos {plan.introductoryMonths} premiers mois
      </p>
      <p className="mt-1 text-sm text-muted">
        {`À partir du ${launchMonth}e mois : ${monthlyPrice(plan.regularMonthlyPrice)}`}
      </p>
      <p className="mt-3 text-sm font-medium text-saas">{plan.promise}</p>

      <p className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
        Économisez {priceLabel(yearlySavings(plan))} la première année
      </p>

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
          Paiement mensuel • Prix de lancement pendant vos{" "}
          {plan.introductoryMonths} premiers mois.
        </p>
      </div>
    </article>
  );
}

function ComparisonTable() {
  return (
    <div className="mx-auto mt-10 max-w-3xl overflow-x-auto">
      <table className="w-full min-w-[440px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left">
            <th className="pb-3 pr-4 font-semibold text-muted">Comparaison</th>
            <th className="pb-3 pr-4 font-bold text-white">Starter</th>
            <th className="pb-3 font-bold text-white">Pro</th>
          </tr>
        </thead>
        <tbody className="text-slate-200">
          <tr className="border-b border-line/70">
            <td className="py-3 pr-4 text-muted">SaaS actifs</td>
            <td className="py-3 pr-4">Jusqu'à {STARTER.saasLimit}</td>
            <td className="py-3">Jusqu'à {PRO.saasLimit}</td>
          </tr>
          <tr className="border-b border-line/70">
            <td className="py-3 pr-4 text-muted">12 premiers mois</td>
            <td className="py-3 pr-4 font-semibold">
              {monthlyPrice(STARTER.introductoryMonthlyPrice)}
            </td>
            <td className="py-3 font-semibold">
              {monthlyPrice(PRO.introductoryMonthlyPrice)}
            </td>
          </tr>
          <tr className="border-b border-line/70">
            <td className="py-3 pr-4 text-muted">Puis</td>
            <td className="py-3 pr-4">
              {monthlyPrice(STARTER.regularMonthlyPrice)}
            </td>
            <td className="py-3">{monthlyPrice(PRO.regularMonthlyPrice)}</td>
          </tr>
          <tr className="border-b border-line/70">
            <td className="py-3 pr-4 text-muted">1re année</td>
            <td className="py-3 pr-4">{priceLabel(firstYearTotal(STARTER))}</td>
            <td className="py-3">{priceLabel(firstYearTotal(PRO))}</td>
          </tr>
          <tr>
            <td className="py-3 pr-4 text-muted">Économie année 1</td>
            <td className="py-3 pr-4 font-semibold text-accent">
              {priceLabel(yearlySavings(STARTER))}
            </td>
            <td className="py-3 font-semibold text-accent">
              {priceLabel(yearlySavings(PRO))}
            </td>
          </tr>
        </tbody>
      </table>
      <p className="mt-3 text-xs text-muted">
        Équivalent 1re année hors promotion : {priceLabel(regularYearTotal(STARTER))} pour
        Starter et {priceLabel(regularYearTotal(PRO))} pour Pro.
      </p>
    </div>
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
          <PlanCard plan={STARTER} />
          <PlanCard plan={PRO} highlighted />
        </div>

        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-line bg-surface px-6 py-5 text-center">
          <p className="text-sm font-semibold text-slate-100">
            Votre première année pour lancer, tester et développer votre
            portefeuille SaaS à tarif réduit.
          </p>
          <p className="mt-1 text-xs text-muted">
            Le tarif normal s&apos;applique automatiquement à partir du 13e mois.
          </p>
        </div>

        <ComparisonTable />

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