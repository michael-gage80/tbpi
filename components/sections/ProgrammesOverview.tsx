"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Users, GraduationCap } from "lucide-react";

const programmes = [
  {
    icon: Users,
    title: "YPAG",
    subtitle: "Young People's Advisory Group",
    description:
      "YPAG unites exceptional young people across the UK to tackle real policy challenges and keep Black communities' priorities in national debates.",
    href: "/programmes",
  },
  {
    icon: GraduationCap,
    title: "FGLP",
    subtitle: "Future Global Leadership Programme",
    description:
      "A 3-day immersive seminar equipping emerging leaders with the skills, networks and knowledge to drive change on a global stage.",
    href: "/programmes",
  },
];

export function ProgrammesOverview() {
  return (
    <section className="bg-[#F7F5F2] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h2 className="text-3xl sm:text-4xl text-[#0A0A0A]">
            Our Programmes
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programmes.map((prog, i) => (
            <motion.div
              key={prog.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group bg-white rounded-xl p-8 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <prog.icon
                className="size-10 text-[#E8581A] mb-5"
                strokeWidth={1.5}
              />
              <h3 className="text-xl mb-1 text-[#0A0A0A]">{prog.title}</h3>
              <p
                className="text-sm text-[#E8581A] font-medium mb-3"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {prog.subtitle}
              </p>
              <p
                className="text-sm text-zinc-600 leading-relaxed mb-6"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {prog.description}
              </p>
              <Link
                href={prog.href}
                className="inline-flex items-center gap-1 text-sm font-medium text-[#E8581A] hover:text-[#C44A13] transition-colors"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Learn More <ArrowRight className="size-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
