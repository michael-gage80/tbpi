import { PolicyAreasHero } from "@/components/sections/policy-areas/PolicyAreasHero";
import { PolicyAreasGrid } from "@/components/sections/policy-areas/PolicyAreasGrid";
import { PolicyAreasCTA } from "@/components/sections/policy-areas/PolicyAreasCTA";

export const metadata = {
  title: "Our Policy Areas",
  description:
    "Six thematic areas of focus — education, employment, health, media, AI and criminal justice — each grounded in evidence, community voice and the imperative for systemic change.",
};

export default function PolicyAreasPage() {
  return (
    <main>
      <PolicyAreasHero />
      <PolicyAreasGrid />
      <PolicyAreasCTA />
    </main>
  );
}
