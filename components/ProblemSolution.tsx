import { IconBulb, IconRocket, IconSearch } from "./icons";
import { WhatsAppButton } from "./WhatsAppButton";

const cards = [
  {
    title: "Lancez plus vite",
    text: "Partez d'une solution existante plutôt que de recommencer chaque projet entièrement de zéro.",
    icon: <IconRocket className="h-6 w-6" />,
  },
  {
    title: "Explorez des opportunités",
    text: "Découvrez des solutions pouvant servir de base à un SaaS ou à un business numérique.",
    icon: <IconBulb className="h-6 w-6" />,
  },
  {
    title: "Profitez de notre veille",
    text: "Notre équipe de 12 développeurs sélectionne, analyse et organise régulièrement de nouvelles ressources.",
    icon: <IconSearch className="h-6 w-6" />,
  },
];

export function ProblemSolution() {
  return (
    <section className="section-pad border-t border-line">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Le principe</p>
          <h2 className="section-title">
            Pourquoi repartir de zéro si une base existe déjà ?
          </h2>
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
          <WhatsAppButton location="problem_solution" size="lg">
            Trouver une solution pour mon projet
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}