"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { TOPIC_COLOURS } from "@/components/sections/research/PublicationsGrid";

export function FeaturedPublication() {
  return (
    <section style={{ backgroundColor: "#F7F5F2" }} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-8"
            style={{ color: "#E8581A", fontFamily: "var(--font-inter)" }}
          >
            Featured Publication
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-2xl bg-white p-8 sm:p-12 shadow-sm border border-zinc-100"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge
                  className="text-white"
                  style={{ backgroundColor: TOPIC_COLOURS["AI & Tech"] }}
                >
                  AI &amp; Tech
                </Badge>
                <Badge variant="outline" className="border-zinc-300 text-zinc-600">
                  White Paper
                </Badge>
                <span
                  className="text-xs text-zinc-500"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  2025
                </span>
              </div>

              <h2
                className="text-2xl sm:text-3xl lg:text-4xl text-[#0A0A0A] mb-4"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                Countering Misinformation in Africa: Local Approaches to AI-Powered Challenges
              </h2>

              <p
                className="text-zinc-500 text-sm mb-3"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Ethan Ward &amp; Chimdi Igwe
              </p>

              <p
                className="text-zinc-600 text-base sm:text-lg leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Examining how African communities and institutions are developing
                locally-grounded strategies to counter AI-powered misinformation,
                with policy recommendations for platform accountability and
                digital resilience.
              </p>
            </div>

            <div className="flex-shrink-0">
              <a
                href="/publications/Countering%20Misinformation%20in%20Africa%3A%20Local%20Approaches%20to%20AI-Powered%20Challenges.pdf"
                download
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium text-white transition-all hover:brightness-90"
                style={{ backgroundColor: "#E8581A", fontFamily: "var(--font-inter)" }}
              >
                Download White Paper <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
