"use client";

import { motion } from "framer-motion";

export function MissionVision() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl text-[#0A0A0A] mb-6">Our Mission</h2>
            <p
              className="text-lg text-zinc-600 leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              To drive racial equity through evidence-based policy research,
              community empowerment and institutional advocacy — creating
              systemic change across the United Kingdom.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h2 className="text-3xl text-[#0A0A0A] mb-6">Our Vision</h2>
            <p
              className="text-lg text-zinc-600 leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              A UK where race is no barrier to opportunity, representation,
              health, education or justice — and where Black communities shape
              the policies that affect them.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
