"use client";

import { motion } from "framer-motion";
import { Play, ExternalLink, Mail, Mic, Newspaper, Video, BookOpen, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const episodes = [
  {
    ep: "E01",
    title: "Journey of a Policy Advisor",
    guest: "Elijah Amoako",
    date: "Oct 2024",
    duration: "34 min",
    audio: "https://media.rss.com/trailblazing-leaders-of-tomorrow/2024_10_18_12_31_03_5e4acdb3-8d2e-45ed-a762-6721b87ec971.mp3",
  },
  {
    ep: "E02",
    title: "Journey of a Legal Associate",
    guest: "Blaise Nsenguwera, Freshfields",
    date: "Oct 2024",
    duration: "29 min",
    audio: "https://media.rss.com/trailblazing-leaders-of-tomorrow/2024_10_21_13_05_49_386e3a98-9c49-42aa-a597-69b35c9a0c06.mp3",
  },
  {
    ep: "E03",
    title: "Journey of a Senior Analyst",
    guest: "Ra-Venne Scholar",
    date: "Oct 2024",
    duration: "34 min",
    audio: "https://media.rss.com/trailblazing-leaders-of-tomorrow/2024_10_25_13_22_19_21e6d2fe-30ef-4074-a308-0e6c26a5b82d.mp3",
  },
  {
    ep: "E04",
    title: "Journey of a President",
    guest: "I. Stephanie Boyce",
    date: "Oct 2024",
    duration: "26 min",
    audio: "https://media.rss.com/trailblazing-leaders-of-tomorrow/2024_10_28_16_57_59_5bef43e1-c087-46aa-9c61-d865645acec0.mp3",
  },
  {
    ep: "E05",
    title: "Journey of a Barristeress",
    guest: "Jennifer Olley",
    date: "Oct 2024",
    duration: "19 min",
    audio: "https://media.rss.com/trailblazing-leaders-of-tomorrow/2024_10_31_17_41_37_c7ffa709-0451-44e3-9c5d-99b28b4b7540.mp3",
  },
  {
    ep: "E06",
    title: "Journey of a Barrister",
    guest: "Stephen Akinsanya",
    date: "Oct 2024",
    duration: "32 min",
    audio: "https://media.rss.com/trailblazing-leaders-of-tomorrow/2024_10_31_18_39_02_0ed3ba49-365f-4a59-9dbd-f8ad5435148b.mp3",
  },
];

const pressHits = [
  {
    outlet: "Islington Tribune",
    headline: "'Black communities feel left out of policy making'",
    date: "Apr 2023",
    href: "https://www.islingtontribune.co.uk/article/black-communities-feel-left-out-of-policy-making",
  },
  {
    outlet: "PoliticsHome — The House",
    headline: "Young Black voices must be heard when policies are being developed",
    date: "Dec 2021",
    href: "https://www.politicshome.com/thehouse/article/young-black-voices-must-be-heard-when-policies-are-being-developed",
  },
  {
    outlet: "The House Live",
    headline: "The UK's Black History Month: From Reflection to Change",
    date: "Oct 2021",
    href: "https://bhm.politicshome.com/blog/the-uks-black-history-month-from-reflection-to-change",
  },
];


const newsletters = [
  { title: "Policy Pulse — February 2026", date: "Feb 2026", href: "#" },
  { title: "Policy Pulse — January 2026", date: "Jan 2026", href: "#" },
  { title: "Policy Pulse — December 2025", date: "Dec 2025", href: "#" },
  { title: "Year in Review 2025 — Special Edition", date: "Dec 2025", href: "#" },
];

const FadeUp = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

function EpisodeList() {
  const [openEp, setOpenEp] = useState<string | null>(null);

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {episodes.map((ep, i) => (
        <FadeUp key={ep.ep} delay={i * 0.1}>
          <Card className="border border-[#E5E2DF] hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex gap-4">
                <button
                  onClick={() => setOpenEp(openEp === ep.ep ? null : ep.ep)}
                  className="w-10 h-10 rounded-lg bg-[#E8581A]/10 hover:bg-[#E8581A] flex items-center justify-center shrink-0 transition-colors group"
                  aria-label={openEp === ep.ep ? "Close player" : "Play episode"}
                >
                  {openEp === ep.ep ? (
                    <ChevronDown className="h-4 w-4 text-[#E8581A] group-hover:text-white transition-colors" />
                  ) : (
                    <Play className="h-4 w-4 text-[#E8581A] group-hover:text-white transition-colors" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#E8581A]">{ep.ep}</span>
                    <span className="text-xs text-[#6B6B6B]">{ep.date} · {ep.duration}</span>
                  </div>
                  <h4
                    className="text-sm font-medium text-[#0A0A0A] leading-snug mb-1"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {ep.title}
                  </h4>
                  <p className="text-xs text-[#6B6B6B]">{ep.guest}</p>
                </div>
              </div>
              {openEp === ep.ep && (
                <audio
                  controls
                  autoPlay
                  className="w-full mt-4"
                  src={ep.audio}
                  preload="auto"
                >
                  Your browser does not support the audio element.
                </audio>
              )}
            </CardContent>
          </Card>
        </FadeUp>
      ))}
    </div>
  );
}

export default function MediaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A0A0A] pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#E8581A]" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full text-[#E8581A] bg-[#E8581A]/10 border border-[#E8581A]/30">
              Media
            </span>
            <h1
              className="text-5xl sm:text-6xl font-normal text-white leading-tight mb-4"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              People, Power &{" "}
              <span className="text-[#E8581A]">Policy</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              Conversations, analysis and thought leadership on race, equity and
              policy — across podcast, press and screen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Podcast */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="flex items-center gap-3 mb-8">
              <Mic className="h-6 w-6 text-[#E8581A]" />
              <h2
                className="text-3xl font-normal text-[#0A0A0A]"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                Trailblazing Leaders Of Tomorrow
              </h2>
            </div>
          </FadeUp>

          {/* Embedded player placeholder */}
          <FadeUp delay={0.1}>
            <div className="bg-[#0A0A0A] rounded-xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-xl bg-[#E8581A] flex items-center justify-center shrink-0">
                <Mic className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-white font-semibold text-lg mb-1">
                  Trailblazing Leaders Of Tomorrow
                </p>
                <p className="text-white/60 text-sm mb-2">
                  By Young People&apos;s Advisory Board · {episodes.length} episodes
                </p>
                <p className="text-white/40 text-xs mb-4 max-w-md">
                  Conversations with innovative professionals shaping future leadership across civil service, law, finance and beyond.
                </p>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <a
                    href="https://media.rss.com/trailblazing-leaders-of-tomorrow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#E8581A] text-white text-sm rounded-full font-medium hover:bg-[#C44A13] transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    Listen Now
                  </a>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Episode list */}
          <EpisodeList />
        </div>
      </section>

      {/* People, Power & Policy — Coming Soon */}
      <section className="bg-[#F7F5F2] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="bg-[#0A0A0A] rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 opacity-70">
              <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Mic className="h-7 w-7 text-white/50" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start mb-2">
                  <p className="text-white font-semibold text-lg">
                    People, Power &amp; Policy
                  </p>
                  <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-[#E8581A]/20 text-[#E8581A] border border-[#E8581A]/30">
                    Coming Soon
                  </span>
                </div>
                <p className="text-white/50 text-sm">
                  Our flagship podcast — conversations on race, equity and policy with leading voices across politics, academia and civil society.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Press */}
      <section className="bg-[#F7F5F2] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="flex items-center gap-3 mb-8">
              <Newspaper className="h-6 w-6 text-[#E8581A]" />
              <h2
                className="text-3xl font-normal text-[#0A0A0A]"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                Press Coverage
              </h2>
            </div>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pressHits.map((hit, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <a
                  href={hit.href}
                  className="group block bg-white rounded-xl p-5 border border-[#E5E2DF] hover:shadow-md transition-all"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-[#E8581A] mb-2">
                    {hit.outlet}
                  </p>
                  <p
                    className="text-sm font-medium text-[#0A0A0A] leading-snug mb-3 group-hover:text-[#E8581A] transition-colors"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {hit.headline}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#6B6B6B]">{hit.date}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-[#6B6B6B] group-hover:text-[#E8581A] transition-colors" />
                  </div>
                </a>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="flex items-center gap-3 mb-8">
              <Video className="h-6 w-6 text-[#E8581A]" />
              <h2
                className="text-3xl font-normal text-[#0A0A0A]"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                Videos
              </h2>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="rounded-xl overflow-hidden aspect-video">
              <iframe
                src="https://www.youtube.com/embed/486PUMsI90s"
                title="TBPI Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Newsletter Archive */}
      <section className="bg-[#F7F5F2] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="h-6 w-6 text-[#E8581A]" />
              <h2
                className="text-3xl font-normal text-[#0A0A0A]"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                Newsletter Archive
              </h2>
            </div>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {newsletters.map((n, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <a
                  href={n.href}
                  className="group flex items-center justify-between bg-white rounded-xl p-5 border border-[#E5E2DF] hover:shadow-md hover:border-[#E8581A] transition-all"
                >
                  <div>
                    <p
                      className="text-sm font-medium text-[#0A0A0A] group-hover:text-[#E8581A] transition-colors"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {n.title}
                    </p>
                    <p className="text-xs text-[#6B6B6B] mt-1">{n.date}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-[#6B6B6B] group-hover:text-[#E8581A] shrink-0 ml-3 transition-colors" />
                </a>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Press Enquiries */}
      <section className="bg-[#0A0A0A] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="max-w-xl">
              <h2
                className="text-3xl font-normal text-white mb-4"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                Press Enquiries
              </h2>
              <p className="text-white/60 mb-6">
                For media requests, interviews and press accreditation, please
                contact our Press Office.
              </p>
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="w-12 h-12 rounded-full bg-[#E8581A] flex items-center justify-center text-white font-bold text-lg shrink-0">
                  PO
                </div>
                <div>
                  <p className="text-white font-semibold">Press Office</p>
                  <p className="text-white/60 text-sm">
                    Media &amp; Communications
                  </p>
                  <a
                    href="mailto:press@theblackpolicyinstitute.org"
                    className="text-[#E8581A] text-sm flex items-center gap-1.5 mt-1 hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    press@theblackpolicyinstitute.org
                  </a>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
