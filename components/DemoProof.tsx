import { EVENT_DEMO_INTENT, WHATSAPP_LINK_DEMO } from "@/lib/constants";
import { DemoVideo } from "./DemoVideo";
import { IconCheck } from "./icons";
import { WhatsAppButton } from "./WhatsAppButton";

const requests = [
  "aperçu de la solution",
  "interface",
  "fonctionnalités principales",
  "type de clients ciblés",
];

export function DemoProof() {
  return (
    <section id="demo" className="section-pad border-t border-line bg-surface/[0.35]">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Démonstration</p>
          <h2 className="section-title">
            Voyez votre futur SaaS avant de choisir.
          </h2>
          <p className="mt-4 text-muted">
            Demandez un aperçu des solutions avant de souscrire. Aucun paiement
            n&apos;est nécessaire pour demander la démonstration.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <DemoVideo
            link={WHATSAPP_LINK_DEMO}
            event={EVENT_DEMO_INTENT}
            location="demo"
            ctaLabel="Demander une démonstration"
          />
        </div>

        <ul className="mx-auto mt-7 grid max-w-2xl gap-x-6 gap-y-2 text-left sm:grid-cols-2">
          {requests.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-muted">
              <IconCheck className="h-4 w-4 shrink-0 text-accent" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <WhatsAppButton
            location="demo"
            link={WHATSAPP_LINK_DEMO}
            event={EVENT_DEMO_INTENT}
            size="lg"
          >
            Demander une démonstration
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}