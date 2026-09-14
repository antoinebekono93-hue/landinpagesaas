import { DemoVideo } from "./DemoVideo";
import { IconCheck } from "./icons";
import { WhatsAppButton } from "./WhatsAppButton";

const highlights = [
  "aperçu de la bibliothèque",
  "catégories disponibles",
  "exemples de solutions",
  "démonstration avant paiement",
];

export function Demo() {
  return (
    <section className="section-pad border-t border-line bg-surface/[0.35]">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Démonstration</p>
          <h2 className="section-title">Voyez MERCO avant de payer</h2>
          <p className="mt-4 text-muted">
            Découvrez le fonctionnement de MERCO et quelques exemples de
            catégories avant d&apos;activer votre accès.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <DemoVideo />
        </div>

        <ul className="mx-auto mt-7 flex max-w-2xl flex-col items-start gap-2 text-sm text-muted sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-6">
          {highlights.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <IconCheck className="h-4 w-4 text-accent" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <WhatsAppButton location="demo" size="lg">
            Voir la démo sur WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}