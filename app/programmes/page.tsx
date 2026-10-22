"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Globe } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { EASE } from "@/lib/motion";

const programmes = [
  {
    icon: Users,
    name: "Young People's Advisory Group",
    tag: "YPAG",
    descriptor: "Engaging challenges to inspire the next generation",
    description:
      "The YPAG brings together exceptional young people from across the UK to engage in real policy challenges and offer a young perspective on the work we do to amplify the voices of Black communities in national conversations.",
    href: "/programmes/ypag",
    cta: "Learn More",
  },
  {
    icon: Globe,
    name: "Future Global Leadership Programme",
    tag: "FGLP",
    descriptor: "3-day immersive seminar for 36 fellows",
    description:
      "A transformative immersive seminar designed to develop the next generation of Black global policy leaders through world-class speakers, policy workshops and peer learning.",
    href: "/programmes/fglp",
    cta: "Apply Now",
  },
];

export default function ProgrammesPage() {
  return (
    <>
      {/* Hero */}
      <PageHero tag="Programmes" heading="Our Programmes" accent="Programmes" subheading="Building the next generation of policy leaders." />

      {/* Programme Tiles */}
      <section className="bg-[#F7F5F2] py-section">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10">
            {programmes.map((prog, i) => (
              <motion.div
                key={prog.tag}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ease: EASE, duration: 0.9, delay: i * 0.15 }}
                className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-zinc-100"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-[#E8581A]/10 flex items-center justify-center">
                      <prog.icon className="w-8 h-8 text-[#E8581A]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-[#E8581A]/10 text-[#E8581A] rounded-full mb-4">
                      {prog.tag}
                    </span>
                    <h2
                      className="text-2xl md:text-3xl text-[#0A0A0A] mb-2"
                      style={{ fontFamily: "var(--font-dm-serif)" }}
                    >
                      {prog.name}
                    </h2>
                    <p
                      className="text-sm font-medium text-zinc-500 mb-4"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {prog.descriptor}
                    </p>
                    <p
                      className="text-zinc-600 leading-relaxed mb-8 max-w-2xl"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {prog.description}
                    </p>
                    <Button
                      asChild
                      className="h-12 px-8 rounded-md bg-[#E8581A] text-white text-base font-medium hover:bg-[#C44A13]"
                    >
                      <Link href={prog.href}>{prog.cta}</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
