"use client";

import { motion } from "framer-motion";

const partners = [
  "USC Annenberg",
  "GenBTV",
  "The Voice",
  "NHS",
  "Ministry of Defence",
  "Eastside Community Heritage",
  "KCL",
  "Morgan Stanley",
];

export function PartnersBar() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl text-[#0A0A0A]">
            Our Partners &amp; Collaborators
          </h2>
        </motion.div>

        <div className="relative overflow-hidden">
          <div className="flex animate-marquee gap-8">
            {[...partners, ...partners].map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="flex-shrink-0 px-6 py-3 rounded-full border border-zinc-200 bg-[#F7F5F2] text-sm font-medium text-[#0A0A0A] whitespace-nowrap"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
