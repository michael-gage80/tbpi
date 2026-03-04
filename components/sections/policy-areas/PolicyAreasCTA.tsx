"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PolicyAreasCTA() {
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
            Deepen our work in your area
          </h2>
          <p
            className="text-lg leading-relaxed mb-10 max-w-2xl mx-auto"
            style={{
              color: "rgba(255,255,255,0.65)",
              fontFamily: "var(--font-inter)",
            }}
          >
            Partner with TBPI to commission research or develop policy in any of
            these areas.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/work-with-us"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-medium text-white transition-all hover:brightness-90"
              style={{
                backgroundColor: "#E8581A",
                fontFamily: "var(--font-inter)",
              }}
            >
              Commission Research <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/research"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-medium text-white border border-white/30 hover:border-white hover:bg-white/5 transition-all"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              View All Publications <ArrowRight className="size-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
