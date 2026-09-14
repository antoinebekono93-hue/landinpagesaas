import { HomeHeader } from "@/components/HomeHeader";
import { HomeHero } from "@/components/HomeHero";
import { IntentCards } from "@/components/IntentCards";
import { LibraryOverview } from "@/components/LibraryOverview";
import { HomeDemo } from "@/components/HomeDemo";
import { HomeValue } from "@/components/HomeValue";
import { HomeProfiles } from "@/components/HomeProfiles";
import { Trust } from "@/components/Trust";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { HomeFinalCTA } from "@/components/HomeFinalCTA";
import { Footer } from "@/components/Footer";
import { StickyCTA } from "@/components/StickyCTA";
import { WHATSAPP_LINK_HOME } from "@/lib/constants";
import { homeFaqs } from "@/lib/content";

export default function Page() {
  return (
    <div className="min-h-screen">
      <HomeHeader />
      <main>
        <HomeHero />
        <IntentCards />
        <LibraryOverview />
        <HomeDemo />
        <HomeValue />
        <HomeProfiles />
        <Trust />
        <HowItWorks />
        <Pricing link={WHATSAPP_LINK_HOME} cta="Découvrir MERCO sur WhatsApp" />
        <FAQ items={homeFaqs} />
        <HomeFinalCTA />
      </main>
      <Footer links={[{ label: "WhatsApp", href: WHATSAPP_LINK_HOME, external: true }]} />
      <StickyCTA
        link={WHATSAPP_LINK_HOME}
        label="💬 Découvrir MERCO"
        ariaLabel="Découvrir MERCO sur WhatsApp (nouvel onglet)"
      />
    </div>
  );
}