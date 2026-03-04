import { HeroSection } from "@/components/sections/HeroSection";
import { MissionStrip } from "@/components/sections/MissionStrip";
import { ImpactNumbers } from "@/components/sections/ImpactNumbers";
import { FeaturedPublications } from "@/components/sections/FeaturedPublications";
import { ProgrammesOverview } from "@/components/sections/ProgrammesOverview";
import { PartnersBar } from "@/components/sections/PartnersBar";
import { NewsletterBanner } from "@/components/sections/NewsletterBanner";

export default function Home() {
  return (
    <>
      <HeroSection />
      <MissionStrip />
      <ImpactNumbers />
      <FeaturedPublications />
      <ProgrammesOverview />
      <PartnersBar />
      <NewsletterBanner />
    </>
  );
}
