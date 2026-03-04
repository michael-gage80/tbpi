"use client";

import { PageHero } from "@/components/sections/PageHero";
import { publications } from "@/components/sections/research/PublicationsGrid";

export function ResearchHero() {
  return (
    <PageHero
      tag={`${publications.length} Publication${publications.length !== 1 ? "s" : ""}`}
      heading="Research & Publications"
      subheading="Evidence-based analysis driving systemic change. Our research centres Black lived experience alongside rigorous data."
    />
  );
}
