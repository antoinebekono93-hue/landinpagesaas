import { PRICE_TEXT, WHATSAPP_LINK } from "@/lib/constants";
import { IconCheck } from "./icons";
import { WhatsAppButton } from "./WhatsAppButton";

const included = [
  "Accès à vie",
  "Bibliothèque numérique",
  "Applications & scripts",
  "Solutions SaaS",
  "Ressources web & mobile",
  "Nouvelles ressources régulièrement",
  "Orientation MERCO",
  "Démonstration disponible avant achat",
];

interface PricingProps {
  link?: string;
  cta?: string;
}

export function Pricing({
  link = WHATSAPP_LINK,
  cta = "Parler à MERCO sur WhatsApp",
}: PricingProps) {
  return (
    <section id="prix" className="section-pad border-t border-line">
      <div className="container-page">
        <div className="mx-auto max-w-md">
          <article className="rounded-2xl border border-accent/40 bg-gradient-to-b from-surface to-surface/[0.5] p-8 shadow-xl shadow-accent/[0.06] sm:p-9">
            <p className="text-sm font-medium text-accent">Une seule offre</p>
            <h2 className="mt-1.5 text-lg font-semibold text-white">
              Accès MERCO à vie
            </h2>

            <div className="mt-5 border-t border-line pt-6">
              <p className="text-5xl font-bold tracking-tight text-white">
                {PRICE_TEXT}
              </p>
              <p className="mt-1.5 text-sm text-muted">Paiement unique</p>
            </div>

            <ul className="mt-7 space-y-3">
              {included.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-slate-200"
                >
                  <IconCheck className="h-4 w-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <WhatsAppButton location="pricing" link={link} size="lg" fullWidth>
                {cta}
              </WhatsAppButton>
            </div>
            <p className="mt-4 text-center text-xs leading-relaxed text-muted">
              Vous pouvez demander une démonstration avant de décider.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}