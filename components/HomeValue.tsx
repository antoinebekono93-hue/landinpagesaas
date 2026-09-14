import { WHATSAPP_LINK_HOME } from "@/lib/constants";
import { IconCompass, IconBulb, IconRocket } from "./icons";
import { WhatsAppButton } from "./WhatsAppButton";

const cards = [
  {
    title: "Ne repartez pas de zéro",
    text: "Utilisez des solutions existantes comme base pour accélérer certains projets.",
    icon: <IconRocket className="h-6 w-6" />,
  },
  {
    title: "Explorez des opportunités",
    text: "Découvrez des solutions pouvant servir de base à un SaaS ou à un business numérique.",
    icon: <IconBulb className="h-6 w-6" />,
  },
  {
    title: "Faites-vous orienter",
    text: "MERCO vous aide à identifier les catégories et solutions correspondant à votre besoin.",
    icon: <IconCompass className="h-6 w-6" />,
  },
];

export function HomeValue() {
  return (
    <section id="valeur" className="section-pad border-t border-line">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">La valeur MERCO</p>
          <h2 className="section-title">De l&apos;idée au projet plus rapidement</h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                {card.icon}
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {card.text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <WhatsAppButton
            location="transformation"
            link={WHATSAPP_LINK_HOME}
            size="lg"
          >
            Parler de mon projet à MERCO
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}