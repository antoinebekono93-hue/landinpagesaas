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

export const metadata: Metadata = {
  title: "MERCO Business – Lancez votre SaaS dès 9 $/mois",
  description:
    "Choisissez jusqu'à 2 ou 5 SaaS avec MERCO Business. Prix de lancement dès 9 $/mois pendant vos 12 premiers mois.",
  alternates: {
    canonical: "/creer-saas",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/creer-saas",
    siteName: "MERCO",
    title: "MERCO Business – Lancez votre SaaS dès 9 $/mois",
    description:
      "Choisissez jusqu'à 2 ou 5 SaaS avec MERCO Business. Prix de lancement dès 9 $/mois pendant vos 12 premiers mois.",
  },
};

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
      <Footer tagline="Votre business SaaS clé en main" />
      <BusinessStickyCTA />
    </div>
  );
}