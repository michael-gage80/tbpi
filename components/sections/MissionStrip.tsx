"use client";

import { motion } from "framer-motion";
import { Lightbulb, BookOpen, Users } from "lucide-react";

const pillars = [
  {
    icon: Lightbulb,
    title: "Inspiration",
    description:
      "Spark evidence-based thinking and intellectual courage across communities and institutions.",
  },
  {
    icon: BookOpen,
    title: "Education",
    description:
      "Build knowledge, capacity and critical understanding through research and programmes.",
  },
  {
    icon: Users,
    title: "Empowerment",
    description:
      "Transform communities through policy advocacy and civic leadership development.",
  },
];

export function MissionStrip() {
  return (
    <section className="bg-[#F7F5F2] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="text-center"
            >
              <pillar.icon className="mx-auto size-12 text-[#E8581A] mb-5" strokeWidth={1.5} />
              <h3 className="text-2xl mb-3 text-[#0A0A0A]">{pillar.title}</h3>
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
