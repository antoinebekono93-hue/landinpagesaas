import { WHATSAPP_LINK_HOME } from "@/lib/constants";
import {
  IconBox,
  IconBrain,
  IconBuilding,
  IconCart,
  IconChart,
  IconCode,
  IconDatabase,
  IconGlobe,
  IconGraduation,
  IconPhone,
  IconTruck,
  IconUsers,
} from "./icons";
import { WhatsAppButton } from "./WhatsAppButton";

const categories = [
  {
    title: "SaaS & logiciels",
    description: "Logiciels et services pouvant servir de base SaaS.",
    icon: <IconBox className="h-5 w-5" />,
  },
  {
    title: "Applications mobiles",
    description: "Applications web et mobiles pour vos projets.",
    icon: <IconPhone className="h-5 w-5" />,
  },
  {
    title: "Flutter",
    description: "Projets et bases Flutter réutilisables.",
    icon: <IconCode className="h-5 w-5" />,
  },
  {
    title: "Scripts PHP",
    description: "Scripts PHP et petits outils techniques.",
    icon: <IconDatabase className="h-5 w-5" />,
  },
  {
    title: "CRM",
    description: "Outils de gestion de la relation client.",
    icon: <IconUsers className="h-5 w-5" />,
  },
  {
    title: "E-commerce",
    description: "Boutiques, marketplaces et solutions de vente.",
    icon: <IconCart className="h-5 w-5" />,
  },
  {
    title: "Intelligence artificielle",
    description: "Ressources IA pour automatiser et enrichir.",
    icon: <IconBrain className="h-5 w-5" />,
  },
  {
    title: "WordPress",
    description: "Plugins, templates et extensions WordPress.",
    icon: <IconGlobe className="h-5 w-5" />,
  },
  {
    title: "LMS / Éducation",
    description: "Plateformes de cours et formation en ligne.",
    icon: <IconGraduation className="h-5 w-5" />,
  },
  {
    title: "Logistique",
    description: "Solutions de livraison, suivi et gestion.",
    icon: <IconTruck className="h-5 w-5" />,
  },
  {
    title: "POS",
    description: "Systèmes de point de vente et de caisse.",
    icon: <IconChart className="h-5 w-5" />,
  },
  {
    title: "Gestion d'entreprise",
    description: "Outils RH, ERP et organisation.",
    icon: <IconBuilding className="h-5 w-5" />,
  },
];

export function LibraryOverview() {
  return (
    <section
      id="bibliotheque"
      className="section-pad border-t border-line bg-surface/[0.35]"
    >
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">La bibliothèque</p>
          <h2 className="section-title">
            Voyez ce que vous pouvez trouver dans MERCO
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <article
              key={category.title}
              className="rounded-xl border border-line bg-surface p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-saas/25 bg-saas/10 text-saas">
                {category.icon}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white">
                {category.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                {category.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <WhatsAppButton
            location="library"
            link={WHATSAPP_LINK_HOME}
            size="lg"
          >
            Je cherche une solution précise
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}