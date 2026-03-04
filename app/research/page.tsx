import { ResearchHero } from "@/components/sections/research/ResearchHero";
import { FeaturedPublication } from "@/components/sections/research/FeaturedPublication";
import { PublicationsGrid } from "@/components/sections/research/PublicationsGrid";
import { CommissionCTA } from "@/components/sections/research/CommissionCTA";

export const metadata = {
  title: "Research & Publications | The Black Policy Institute",
  description:
    "Evidence-based analysis driving systemic change. Explore our research publications on education, employment, health, media, AI and criminal justice.",
};

export default function ResearchPage() {
  return (
    <main>
      <ResearchHero />
      <FeaturedPublication />
      <PublicationsGrid />
      <CommissionCTA />
    </main>
  );
}
