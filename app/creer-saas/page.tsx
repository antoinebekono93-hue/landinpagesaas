import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ThreeSteps } from "@/components/ThreeSteps";
import { CatalogSection } from "@/components/CatalogSection";
import { PossibilitiesSection } from "@/components/PossibilitiesSection";
import { DemoProof } from "@/components/DemoProof";
import { ForWhom } from "@/components/ForWhom";
import { ComparisonTable } from "@/components/ComparisonTable";
import { BusinessPricing } from "@/components/BusinessPricing";
import { BusinessModel } from "@/components/BusinessModel";
import { ApiCosts } from "@/components/ApiCosts";
import { HostingTransparency } from "@/components/HostingTransparency";
import { TrustStrip } from "@/components/TrustStrip";
import { FAQ } from "@/components/FAQ";
import { LibraryAlternative } from "@/components/LibraryAlternative";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { BusinessStickyCTA } from "@/components/BusinessStickyCTA";
import { WHATSAPP_LINK_HOME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "MERCO Business – Lancez votre propre SaaS dès 5 000 FCFA/mois",
  description:
    "Choisissez 2 ou 5 solutions SaaS, MERCO s'occupe de la mise en ligne et de l'hébergement prévu par votre plan. Lancez votre activité SaaS plus simplement.",
  alternates: {
    canonical: "/creer-saas",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/creer-saas",
    siteName: "MERCO",
    title: "MERCO Business – Lancez votre propre SaaS dès 5 000 FCFA/mois",
    description:
      "Choisissez 2 ou 5 solutions SaaS, MERCO s'occupe de la mise en ligne et de l'hébergement prévu par votre plan. Lancez votre activité SaaS plus simplement.",
  },
};

const footerLinks = [
  { label: "Catalogue", href: "#catalogue" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "FAQ", href: "#faq" },
  { label: "WhatsApp", href: WHATSAPP_LINK_HOME, external: true },
];

export default function Page() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <ThreeSteps />
        <CatalogSection />
        <PossibilitiesSection />
        <DemoProof />
        <ForWhom />
        <ComparisonTable />
        <BusinessPricing />
        <BusinessModel />
        <ApiCosts />
        <HostingTransparency />
        <TrustStrip />
        <FAQ />
        <LibraryAlternative />
        <FinalCTA />
      </main>
      <Footer
        tagline="Votre business SaaS clé en main"
        replaceDefaults
        links={footerLinks}
      />
      <BusinessStickyCTA />
    </div>
  );
}