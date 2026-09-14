import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Demo } from "@/components/Demo";
import { ProblemSolution } from "@/components/ProblemSolution";
import { ProjectCategories } from "@/components/ProjectCategories";
import { Profiles } from "@/components/Profiles";
import { Trust } from "@/components/Trust";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { StickyCTA } from "@/components/StickyCTA";

export const metadata: Metadata = {
  title: "MERCO – Lancez votre SaaS plus rapidement",
  description:
    "Découvrez des applications, scripts et solutions SaaS avec MERCO. Accès à vie à 10 000 FCFA et démonstration disponible.",
  alternates: {
    canonical: "/creer-saas",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/creer-saas",
    siteName: "MERCO",
    title: "MERCO – Lancez votre SaaS plus rapidement",
    description:
      "Découvrez des applications, scripts et solutions SaaS avec MERCO. Accès à vie à 10 000 FCFA et démonstration disponible.",
  },
};

export default function Page() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Demo />
        <ProblemSolution />
        <ProjectCategories />
        <Profiles />
        <Trust />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
}