import {
  IconChat,
  IconGauge,
  IconLayers,
  IconShield,
  IconUsers,
  IconCheck,
} from "./icons";

const points = [
  {
    title: "Équipe MERCO",
    text: "Une équipe derrière la mise en ligne et le suivi de votre abonnement.",
    icon: <IconUsers className="h-5 w-5" />,
  },
  {
    title: "Démonstration avant souscription",
    text: "Demandez un aperçu avant de choisir votre plan.",
    icon: <IconCheck className="h-5 w-5" />,
  },
  {
    title: "Hébergement géré selon le plan",
    text: "MERCO gère l'environnement prévu par votre abonnement.",
    icon: <IconGauge className="h-5 w-5" />,
  },
  {
    title: "Support WhatsApp",
    text: "Un canal direct pour être orienté et suivi.",
    icon: <IconChat className="h-5 w-5" />,
  },
  {
    title: "Catalogue vérifié",
    text: "Les SaaS sont ajoutés après vérification d'éligibilité et de licence.",
    icon: <IconLayers className="h-5 w-5" />,
  },
  {
    title: "Conditions transparentes",
    text: "API externes, hébergement et licences expliqués clairement.",
    icon: <IconShield className="h-5 w-5" />,
  },
];

export function TrustStrip() {
  return (
    <section className="section-pad border-t border-line">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Confiance</p>
          <h2 className="section-title">Un cadre clair et transparent</h2>
        </div>

        <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((point) => (
            <li key={point.title} className="card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
                {point.icon}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white">
                {point.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {point.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}