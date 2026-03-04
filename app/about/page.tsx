import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { MissionVision } from "@/components/sections/about/MissionVision";
import { OurStory } from "@/components/sections/about/OurStory";
import { StrategicApproach } from "@/components/sections/about/StrategicApproach";
import { TeamBios } from "@/components/sections/about/TeamBios";
import { Advisory } from "@/components/sections/about/Advisory";
import { Governance } from "@/components/sections/about/Governance";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about The Black Policy Institute — a non-partisan racial equity think tank built on evidence, community and change.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionVision />
      <OurStory />
      <StrategicApproach />
      <TeamBios />
      <Advisory />
      <Governance />
    </>
  );
}
