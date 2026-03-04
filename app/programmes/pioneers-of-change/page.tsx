"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Search,
  PenTool,
  Rocket,
  Anchor,
  CheckCircle,
  Building2,
  Landmark,
  Heart,
  GraduationCap,
} from "lucide-react";

const phases = [
  {
    icon: Search,
    phase: "Phase 1",
    title: "Discovery",
    sessions: "Sessions 1-5",
    description:
      "Comprehensive DEI audit, stakeholder interviews, data analysis and baseline benchmarking to understand where you are.",
  },
  {
    icon: PenTool,
    phase: "Phase 2",
    title: "Design",
    sessions: "Sessions 6-10",
    description:
      "Co-create a tailored DEI strategy, action plan and KPIs aligned with your organisation's mission and goals.",
  },
  {
    icon: Rocket,
    phase: "Phase 3",
    title: "Delivery",
    sessions: "Sessions 11-18",
    description:
      "Training workshops, leadership coaching, policy development and implementation support across your organisation.",
  },
  {
    icon: Anchor,
    phase: "Phase 4",
    title: "Embed",
    sessions: "Sessions 19-22",
    description:
      "Impact measurement, sustainability planning and handover to internal champions to ensure lasting change.",
  },
];

const included = [
  "DEI audit and diagnostic report",
  "Strategy development and roadmap",
  "Training workshops for all levels",
  "Leadership coaching for senior team",
  "Implementation support and guidance",
  "Impact measurement and final report",
];

const audiences = [
  {
    icon: Building2,
    title: "Corporates",
    description:
      "FTSE 250 firms, professional services, financial institutions and tech companies.",
  },
  {
    icon: Landmark,
    title: "Public Sector",
    description:
      "Government departments, local authorities, NHS trusts and policing bodies.",
  },
  {
    icon: Heart,
    title: "NGOs & Charities",
    description:
      "Third sector organisations committed to equity within their own structures.",
  },
  {
    icon: GraduationCap,
    title: "Education Institutions",
    description:
      "Universities, colleges and schools seeking to embed anti-racist practice.",
  },
];

export default function PioneersOfChangePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A0A0A] pt-20 pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl text-white leading-tight"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Pioneers of Change
              <span className="block mt-2 h-1 w-24 bg-[#E8581A] rounded-full" />
            </h1>
            <p
              className="mt-4 text-xl text-[#E8581A] font-medium"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              DEI Consultancy Programme
            </p>
            <p
              className="mt-6 text-xl text-zinc-400 leading-relaxed max-w-2xl"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              A comprehensive 22-session transformation programme for
              organisations serious about equity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What It Is */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h2
              className="text-3xl md:text-4xl text-[#0A0A0A] mb-6"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              What It Is
            </h2>
            <p
              className="text-lg text-zinc-600 leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              A comprehensive 22-session DEI transformation programme for
              organisations serious about building equitable, inclusive
              workplaces. We partner with you to diagnose, design and deliver
              lasting change.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programme Structure */}
      <section className="bg-[#F7F5F2] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl text-[#0A0A0A] mb-12"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Programme Structure
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-sm relative"
              >
                {i < phases.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#E8581A]" />
                )}
                <div className="w-12 h-12 rounded-lg bg-[#E8581A]/10 flex items-center justify-center mb-4">
                  <phase.icon className="w-6 h-6 text-[#E8581A]" />
                </div>
                <span className="text-xs font-medium text-[#E8581A] mb-1 block">
                  {phase.phase} &middot; {phase.sessions}
                </span>
                <h3
                  className="text-xl text-[#0A0A0A] mb-3"
                  style={{ fontFamily: "var(--font-dm-serif)" }}
                >
                  {phase.title}
                </h3>
                <p
                  className="text-zinc-600 text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {phase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl text-[#0A0A0A] mb-12"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Who It&apos;s For
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {audiences.map((aud, i) => (
              <motion.div
                key={aud.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#F7F5F2] rounded-xl p-6"
              >
                <aud.icon className="w-8 h-8 text-[#E8581A] mb-4" />
                <h3
                  className="text-lg font-semibold text-[#0A0A0A] mb-2"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {aud.title}
                </h3>
                <p
                  className="text-zinc-600 text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {aud.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-[#F7F5F2] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className="text-3xl md:text-4xl text-[#0A0A0A] mb-8"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                What&apos;s Included
              </h2>
              <ul className="space-y-4">
                {included.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-[#E8581A] flex-shrink-0 mt-0.5" />
                    <span
                      className="text-zinc-700"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-white rounded-xl p-8 shadow-sm"
            >
              <h3
                className="text-2xl text-[#0A0A0A] mb-4"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                Investment
              </h3>
              <p
                className="text-zinc-600 leading-relaxed mb-6"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Tailored to organisation size and scope. Contact us for a
                scoping conversation to discuss your needs and receive a bespoke
                proposal.
              </p>
              <Button
                asChild
                className="h-12 px-8 rounded-md bg-[#E8581A] text-white text-base font-medium hover:bg-[#C44A13]"
              >
                <Link href="/contact?type=pioneers">Enquire Now</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
