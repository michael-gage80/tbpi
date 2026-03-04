"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Quote } from "lucide-react";

const stats = [
  { value: "36", label: "Fellows" },
  { value: "3", label: "Days" },
  { value: "15+", label: "Speakers" },
  { value: "12", label: "Countries Represented" },
];

const days = [
  {
    day: "Day 1",
    title: "Foundations",
    description:
      "Geopolitics and global governance, with keynotes from senior diplomats and policy thinkers. Fellows map their leadership landscape and form working groups.",
  },
  {
    day: "Day 2",
    title: "Deep Dives",
    description:
      "Economics, technology and social justice workshops. Fellows engage with live policy simulations and develop cross-border recommendations.",
  },
  {
    day: "Day 3",
    title: "Action & Legacy",
    description:
      "Fellows present policy proposals to a panel of experts, build lasting networks and commit to post-programme action plans.",
  },
];

const alumni = [
  {
    name: "Amara Okafor",
    role: "Policy Advisor, African Union",
    quote:
      "FGLP gave me the confidence and framework to lead on Pan-African trade policy at the continental level.",
  },
  {
    name: "David Mensah",
    role: "Head of Strategy, Tech for Good Foundation",
    quote:
      "The connections I made during those three days have shaped my entire career trajectory.",
  },
  {
    name: "Priya Kaur-Williams",
    role: "Parliamentary Researcher, UK Parliament",
    quote:
      "FGLP doesn't just teach leadership — it creates a community of leaders who hold each other accountable.",
  },
];

export default function FGLPPage() {
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
              Future Global
              <br />
              Leadership Programme
              <span className="block mt-2 h-1 w-24 bg-[#E8581A] rounded-full" />
            </h1>
            <p
              className="mt-8 text-xl text-zinc-400 leading-relaxed max-w-2xl"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              A transformative 3-day immersive seminar for the next generation of
              Black global policy leaders.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-16"
          >
            <h2
              className="text-3xl md:text-4xl text-[#0A0A0A] mb-6"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Programme Overview
            </h2>
            <p
              className="text-lg text-zinc-600 leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              A transformative 3-day immersive seminar designed to develop the
              next generation of Black global policy leaders. Participants engage
              with world-class speakers, policy workshops and peer learning
              across geopolitics, economics, technology and social justice.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div
                  className="text-4xl md:text-5xl text-[#E8581A] mb-2"
                  style={{ fontFamily: "var(--font-dm-serif)" }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-zinc-500 text-sm font-medium"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cohort Experience */}
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
            The Cohort Experience
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {days.map((day, i) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-white rounded-xl p-8 shadow-sm"
              >
                <span className="inline-block px-3 py-1 text-xs font-medium bg-[#E8581A] text-white rounded-full mb-4">
                  {day.day}
                </span>
                <h3
                  className="text-xl text-[#0A0A0A] mb-3"
                  style={{ fontFamily: "var(--font-dm-serif)" }}
                >
                  {day.title}
                </h3>
                <p
                  className="text-zinc-600 leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {day.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Spotlight */}
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
            Alumni Spotlight
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {alumni.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-[#F7F5F2] rounded-xl p-8"
              >
                <Quote className="w-8 h-8 text-[#E8581A] mb-4" />
                <p
                  className="text-zinc-700 leading-relaxed mb-6"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  &ldquo;{person.quote}&rdquo;
                </p>
                <div>
                  <p
                    className="font-semibold text-[#0A0A0A]"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {person.name}
                  </p>
                  <p
                    className="text-sm text-zinc-500"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {person.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply CTA */}
      <section className="bg-[#0A0A0A] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-3xl md:text-4xl text-white mb-6"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Ready to Lead on the Global Stage?
            </h2>
            <p
              className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Applications for the 2026 cohort are now open. Join 36 exceptional
              fellows from around the world.
            </p>
            <Button
              asChild
              className="h-12 px-8 rounded-md bg-[#E8581A] text-white text-base font-medium hover:bg-[#C44A13]"
            >
              <Link href="/contact?type=programmes">Apply Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
