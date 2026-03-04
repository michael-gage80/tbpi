"use client";

import { motion } from "framer-motion";
import { Play, ExternalLink, Mail, Mic, Newspaper, Video, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const episodes = [
  {
    ep: "E24",
    title: "The Politics of Black Health: NHS, Data and Disparity",
    guest: "Dr. Yemi Oduya, NHS England",
    date: "Feb 2026",
    duration: "52 min",
  },
  {
    ep: "E23",
    title: "AI Governance and the African Diaspora",
    guest: "Ethan Ward, TBPI",
    date: "Jan 2026",
    duration: "44 min",
  },
  {
    ep: "E22",
    title: "Criminal Justice Reform: A Community Perspective",
    guest: "Baroness Doreen Lawrence OBE",
    date: "Dec 2025",
    duration: "61 min",
  },
  {
    ep: "E21",
    title: "Black Women in Leadership: Barriers and Breakthroughs",
    guest: "Nadjah Osman, YPAG Co-Lead",
    date: "Nov 2025",
    duration: "48 min",
  },
];

const pressHits = [
  {
    outlet: "The Guardian",
    headline: "Think tank calls for overhaul of stop-and-search practices",
    date: "Jan 2026",
    href: "#",
  },
  {
    outlet: "BBC News",
    headline: "TBPI report reveals Black health disparities in NHS maternity care",
    date: "Dec 2025",
    href: "#",
  },
  {
    outlet: "The Voice",
    headline: "Policy institute launches pioneering DEI programme for corporates",
    date: "Nov 2025",
    href: "#",
  },
  {
    outlet: "Times Higher Education",
    headline: "Decolonising the curriculum: new framework published by TBPI",
    date: "Oct 2025",
    href: "#",
  },
  {
    outlet: "ITV News",
    headline: "Youth advisory group amplifies Black voices in Westminster",
    date: "Sep 2025",
    href: "#",
  },
  {
    outlet: "Financial Times",
    headline: "AI and race: why Britain's tech sector must act now",
    date: "Aug 2025",
    href: "#",
  },
];

const videos = [
  {
    title: "What is the Black Policy Institute? | Explainer",
    channel: "TBPI Official",
    duration: "4:32",
    views: "12K views",
  },
  {
    title: "Future Global Leadership Programme 2025 — Highlights",
    channel: "TBPI Official",
    duration: "8:17",
    views: "5.4K views",
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
                People, Power & Policy Podcast
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
                  People, Power & Policy
                </p>
                <p className="text-white/60 text-sm mb-4">
                  By The Black Policy Institute · 24 episodes · Available on
                  Spotify and Apple Podcasts
                </p>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-white text-sm rounded-full font-medium hover:bg-[#1aa34a] transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    Listen on Spotify
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 bg-[#872EC4] text-white text-sm rounded-full font-medium hover:opacity-90 transition-opacity"
                  >
                    <Play className="h-4 w-4" />
                    Apple Podcasts
                  </a>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Episode list */}
          <div className="grid sm:grid-cols-2 gap-4">
            {episodes.map((ep, i) => (
              <FadeUp key={ep.ep} delay={i * 0.1}>
                <Card className="border border-[#E5E2DF] hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-5 flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#E8581A]/10 flex items-center justify-center shrink-0 group-hover:bg-[#E8581A] transition-colors">
                      <Play className="h-4 w-4 text-[#E8581A] group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#E8581A]">
                          {ep.ep}
                        </span>
                        <span className="text-xs text-[#6B6B6B]">
                          {ep.date} · {ep.duration}
                        </span>
                      </div>
                      <h4
                        className="text-sm font-medium text-[#0A0A0A] leading-snug mb-1 truncate"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {ep.title}
                      </h4>
                      <p className="text-xs text-[#6B6B6B]">{ep.guest}</p>
                    </div>
                  </CardContent>
                </Card>
              </FadeUp>
            ))}
          </div>
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
          <div className="grid sm:grid-cols-2 gap-6">
            {videos.map((v, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="group cursor-pointer">
                  <div className="relative bg-[#0A0A0A] rounded-xl overflow-hidden aspect-video mb-3 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#E8581A]/20 to-transparent" />
                    <div className="w-16 h-16 rounded-full bg-white/10 group-hover:bg-[#E8581A] flex items-center justify-center transition-colors">
                      <Play className="h-6 w-6 text-white ml-1" />
                    </div>
                    <span className="absolute bottom-3 right-3 text-xs bg-black/70 text-white px-2 py-0.5 rounded">
                      {v.duration}
                    </span>
                  </div>
                  <h4
                    className="text-sm font-medium text-[#0A0A0A] group-hover:text-[#E8581A] transition-colors"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {v.title}
                  </h4>
                  <p className="text-xs text-[#6B6B6B] mt-1">
                    {v.channel} · {v.views}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
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
                contact our Communications Director.
              </p>
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="w-12 h-12 rounded-full bg-[#E8581A] flex items-center justify-center text-white font-bold text-lg shrink-0">
                  NA
                </div>
                <div>
                  <p className="text-white font-semibold">Nathaniel Adeleye</p>
                  <p className="text-white/60 text-sm">
                    Communications Director
                  </p>
                  <a
                    href="mailto:press@tbpi.co.uk"
                    className="text-[#E8581A] text-sm flex items-center gap-1.5 mt-1 hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    press@tbpi.co.uk
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
