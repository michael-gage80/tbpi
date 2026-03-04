"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CommissionCTA() {
  return (
    <section
      style={{ backgroundColor: "#0A0A0A" }}
      className="py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-3xl sm:text-4xl text-white mb-6"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Commission Research
          </h2>
          <p
            className="text-lg leading-relaxed mb-10 max-w-2xl mx-auto"
            style={{
              color: "rgba(255,255,255,0.65)",
              fontFamily: "var(--font-inter)",
            }}
          >
            Need evidence-based research tailored to your organisation&apos;s
            challenges? We work with government bodies, NGOs, corporates and
            foundations to produce rigorous, actionable research.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-medium text-white transition-all hover:brightness-90"
            style={{
              backgroundColor: "#E8581A",
              fontFamily: "var(--font-inter)",
            }}
          >
            Get in Touch <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
