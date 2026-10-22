"use client";

import { motion } from "framer-motion";
import { Coffee } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { EASE } from "@/lib/motion";

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
    transition={{ ease: EASE, duration: 0.9, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function StaffLandingPage() {
  return (
    <>
      {/* Hero */}
      <PageHero tag="Staff" heading="Staff area" accent="area" subheading="Tools and spaces for the TBPI team." />

      {/* Options */}
      <section className="bg-[#F7F5F2] py-section px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          {/* Staff Room — coming soon */}
          <FadeUp>
            <div className="h-full rounded-2xl border border-[#E5E2DF] bg-white/60 p-8 opacity-70">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#0A0A0A]/5">
                  <Coffee className="size-6 text-[#6B6B6B]" />
                </div>
                <span className="rounded-full border border-[#E5E2DF] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#6B6B6B]">
                  Coming soon
                </span>
              </div>
              <h2
                className="text-2xl font-normal text-[#0A0A0A]"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                Staff Room
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#6B6B6B]">
                A shared space for the team — resources, culture and connection. We&apos;re still
                building it.
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#9A9A9A]">
                Not available yet
              </span>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
