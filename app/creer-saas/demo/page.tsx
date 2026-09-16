import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { DemoVideo } from "@/components/DemoVideo";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { IconCheck } from "@/components/icons";
import { EVENT_DEMO_INTENT, WHATSAPP_LINK_DEMO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Démo MERCO Business – Découvrez les SaaS avant de choisir",
  description:
    "Demandez un aperçu des SaaS MERCO avant de choisir votre plan : interface, fonctionnalités, types de solutions et fonctionnement de l'offre. Aucun paiement nécessaire.",
  alternates: {
    canonical: "/creer-saas/demo",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/creer-saas/demo",
    siteName: "MERCO",
    title: "Démo MERCO Business – Découvrez les SaaS avant de choisir",
    description:
      "Demandez un aperçu des SaaS MERCO avant de choisir votre plan. Aucun paiement nécessaire.",
  },
};

const crumbs = [
  { label: "MERCO", href: "/" },
  { label: "Business SaaS", href: "/creer-saas" },
  { label: "Démo", current: true },
];

const highlights = [
  "interface",
  "fonctionnalités principales",
  "types de SaaS disponibles",
  "fonctionnement de l’offre",
];

export default function DemoPage() {
  return (
    <PageShell crumbs={crumbs} location="breadcrumbs_demo">
      <section className="container-page py-10 sm:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Voyez MERCO avant de choisir votre plan
          </h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
            Demandez un aperçu des solutions avant de souscrire. Aucun paiement
            n&apos;est nécessaire pour demander la démonstration.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <DemoVideo
            link={WHATSAPP_LINK_DEMO}
            event={EVENT_DEMO_INTENT}
            location="demo_page"
            ctaLabel="Demander une démonstration"
          />
        </div>

        <ul className="mx-auto mt-7 grid max-w-2xl gap-x-6 gap-y-2 text-left sm:grid-cols-2">
          {highlights.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-muted">
              <IconCheck className="h-4 w-4 shrink-0 text-accent" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <WhatsAppButton
            location="demo_page"
            link={WHATSAPP_LINK_DEMO}
            event={EVENT_DEMO_INTENT}
            size="lg"
          >
            Demander une démonstration
          </WhatsAppButton>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-sm leading-relaxed text-muted">
          Après la démonstration, vous pourrez choisir le plan{" "}
          <a href="/creer-saas/starter" className="font-medium text-accent hover:underline">
            Starter
          </a>{" "}
          ou{" "}
          <a href="/creer-saas/pro" className="font-medium text-accent hover:underline">
            Pro
          </a>{" "}
          qui vous convient, puis sélectionner vos SaaS dans le{" "}
          <a href="/creer-saas/catalogue" className="font-medium text-accent hover:underline">
            catalogue
          </a>
          .
        </p>
      </section>
    </PageShell>
  );
}