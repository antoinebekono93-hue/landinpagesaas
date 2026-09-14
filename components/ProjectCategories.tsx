import {
  IconBox,
  IconBuilding,
  IconCart,
  IconGraduation,
  IconPhone,
  IconTruck,
} from "./icons";
import { WhatsAppButton } from "./WhatsAppButton";

const categories = [
  {
    title: "SaaS & logiciels",
    chips: "CRM • RH • Marketing • IA",
    icon: <IconBox className="h-6 w-6" />,
  },
  {
    title: "E-commerce",
    chips: "Boutiques • Marketplace • POS",
    icon: <IconCart className="h-6 w-6" />,
  },
  {
    title: "Applications mobiles",
    chips: "Flutter • Android • Services",
    icon: <IconPhone className="h-6 w-6" />,
  },
  {
    title: "Éducation",
    chips: "LMS • Cours • Plateformes",
    icon: <IconGraduation className="h-6 w-6" />,
  },
  {
    title: "Logistique",
    chips: "Livraison • Gestion • Suivi",
    icon: <IconTruck className="h-6 w-6" />,
  },
  {
    title: "Entreprises",
    chips: "CRM • ERP • Automatisation",
    icon: <IconBuilding className="h-6 w-6" />,
  },
];

export function ProjectCategories() {
  return (
    <section className="section-pad border-t border-line bg-surface/[0.35]">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Votre projet</p>
          <h2 className="section-title">Quel projet voulez-vous lancer ?</h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((item) => (
            <article key={item.title} className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-saas/30 bg-saas/10 text-saas">
                {item.icon}
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{item.chips}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted">
            Vous cherchez quelque chose de précis ?
          </p>
          <div className="mt-4 flex justify-center">
            <WhatsAppButton location="categories" size="lg">
              Parler à MERCO sur WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </section>
  );
}