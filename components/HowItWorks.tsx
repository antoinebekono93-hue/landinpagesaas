import { WHATSAPP_LINK_HOME } from "@/lib/constants";
import { WhatsAppButton } from "./WhatsAppButton";

const steps = [
  {
    title: "Expliquez votre besoin",
    text: "Dites-nous ce que vous souhaitez créer ou trouver.",
  },
  {
    title: "Découvrez MERCO",
    text: "Consultez les catégories ou demandez une démonstration.",
  },
  {
    title: "Activez votre accès",
    text: "Paiement unique de 10 000 FCFA.",
  },
  {
    title: "Lancez votre premier projet",
    text: "Accédez à la bibliothèque et laissez MERCO vous orienter.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="fonctionnement"
      className="section-pad border-t border-line"
    >
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Étapes</p>
          <h2 className="section-title">Comment ça marche ?</h2>
        </div>

        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="card relative p-6">
              <span
                aria-hidden="true"
                className="absolute right-6 top-6 text-4xl font-bold text-line-soft/60"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="pr-10 text-base font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.text}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex justify-center">
          <WhatsAppButton
            location="how"
            link={WHATSAPP_LINK_HOME}
            size="lg"
          >
            Commencer sur WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}