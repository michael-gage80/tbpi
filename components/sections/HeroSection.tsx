"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SplitText } from "@/components/motion/SplitText";
import { ScrollFade } from "@/components/motion/ScrollFade";
import { publications } from "@/components/sections/research/PublicationsGrid";

const policyAreas = [
  "Education",
  "Employment & economic equity",
  "Health & wellbeing",
  "Media representation",
  "AI & technology",
  "Criminal justice & policing",
];

const latest = publications[0];

export function HeroSection() {
  return (
    <section className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0A0A0A] text-white">
      {/* Warm glow, drifting very slowly */}
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute -right-[20vw] top-[10vh] size-[70vw] max-w-[1100px] max-h-[1100px] rounded-full opacity-60"
        style={{ background: "radial-gradient(closest-side, rgba(232,88,26,0.28), rgba(232,88,26,0.06) 55%, transparent)" }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pt-24 sm:pt-28 lg:px-8">
        {/* Masthead */}
        <div className="rise flex items-center justify-between gap-6 text-[11px] uppercase tracking-[0.18em] text-white/50">
          <span>Est. 2020 · TBPI CIC</span>
          <span className="hidden font-heading text-base normal-case italic tracking-normal text-white/70 md:inline">
            Racial equity, evidenced.
          </span>
          <span className="hidden sm:inline"><Today /></span>
        </div>
        <div className="mt-4 space-y-[3px]" aria-hidden>
          <div className="rule-draw h-px bg-white/25" style={{ "--d": "0.1s" } as React.CSSProperties} />
          <div className="rule-draw h-px bg-white/25" style={{ "--d": "0.2s" } as React.CSSProperties} />
        </div>

        <ScrollFade className="flex flex-1 flex-col justify-center py-12 lg:py-14">
          <p className="eyebrow rise text-white/60" style={{ "--d": "0.3s" } as React.CSSProperties}>
            Non-partisan racial equity think tank · United Kingdom
          </p>
          <SplitText
            as="h1"
            trigger="load"
            delay={0.35}
            text={"Evidence-based policy.\nCommunity-powered change."}
            accent="change."
            className="mt-8 text-display font-normal"
          />

          <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="rise max-w-2xl text-lede text-white/65" style={{ "--d": "0.9s" } as React.CSSProperties}>
                We drive racial equity through rigorous research, community
                empowerment and transformative policy development across the UK.
              </p>
              <div className="rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ "--d": "1.05s" } as React.CSSProperties}>
                <Link
                  href="/work-with-us"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#E8581A] px-7 font-medium text-white transition-colors hover:bg-[#C44A13]"
                >
                  Commission us <ArrowRight className="nudge size-4" />
                </Link>
                <Link
                  href="/research"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-7 font-medium text-white transition-colors hover:border-white hover:bg-white/5"
                >
                  Explore research <ArrowRight className="nudge size-4" />
                </Link>
              </div>
            </div>

            {latest && (
              <div className="hero-card lg:col-span-5">
                <a
                  href={latest.file ?? "/research"}
                  className="spot group block rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-colors hover:border-white/25"
                >
                  <p className="eyebrow text-[#E8581A]">Latest {latest.type.toLowerCase()}</p>
                  <h2 className="mt-4 font-heading text-[clamp(1.25rem,1.6vw,1.5rem)] leading-snug">
                    {latest.title}
                  </h2>
                  <p className="mt-2 text-sm text-white/50">
                    {latest.author} · {latest.date}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white">
                    Read the paper <ArrowUpRight className="nudge size-4" />
                  </span>
                </a>
              </div>
            )}
          </div>
        </ScrollFade>
      </div>

      {/* Policy areas ticker */}
      <div className="rise relative z-20 border-t border-white/10 bg-[#0A0A0A] py-5" style={{ "--d": "1.4s" } as React.CSSProperties}>
        <div className="marquee-mask overflow-hidden">
          <div className="animate-marquee flex w-max" style={{ animationDuration: "60s" }}>
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                {policyAreas.map((area) => (
                  <li key={area} className="flex items-center whitespace-nowrap font-heading text-xl italic text-white/70">
                    <span className="px-8">{area}</span>
                    <span className="size-1.5 rounded-full bg-[#E8581A]" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Read on the client only: the page is static, so a server-rendered date would go stale.
const noSubscribe = () => () => {};
const todayLabel = () =>
  new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

function Today() {
  const label = useSyncExternalStore(noSubscribe, todayLabel, () => "");
  return <span className="min-w-[1px] text-right">{label}</span>;
}
