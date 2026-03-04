"use client";

import { motion } from "framer-motion";
import { Search, FileText, HeartHandshake } from "lucide-react";

const pillars = [
  {
    icon: Search,
    title: "Research & Evidence",
    description:
      "We produce rigorous, peer-informed research that centres Black lived experience alongside quantitative data.",
  },
  {
    icon: FileText,
    title: "Policy Development",
    description:
      "We translate research into actionable policy recommendations for government, institutions and civil society.",
  },
  {
    icon: HeartHandshake,
    title: "Community Empowerment",
    description:
      "We build the capacity of communities and the next generation of Black policy leaders through our programmes.",
  },
];

export function StrategicApproach() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h2 className="text-3xl sm:text-4xl text-[#0A0A0A]">
            Our Strategic Approach
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-[#F7F5F2] rounded-xl p-8"
            >
              <pillar.icon
                className="size-10 text-[#E8581A] mb-5"
                strokeWidth={1.5}
              />
              <h3 className="text-xl mb-3 text-[#0A0A0A]">{pillar.title}</h3>
              <p
                className="text-zinc-600 leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
