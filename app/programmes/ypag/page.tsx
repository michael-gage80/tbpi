"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Quote } from "lucide-react";

const gains = [
  "Develop practical policy analysis and advocacy skills through hands-on workshops and real briefs",
  "Access mentorship from senior policy professionals and TBPI leadership",
  "Join a powerful network of ambitious young leaders committed to racial equity",
  "Gain a platform to influence national conversations and shape policy recommendations",
];

const eligibility = [
  "Aged 18-28 at the time of application",
  "Based in the United Kingdom",
  "Passionate about racial equity and social justice",
  "Committed to attending regular sessions and contributing to group projects",
];

export default function YPAGPage() {
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
            <span className="inline-block px-3 py-1 text-xs font-medium bg-[#E8581A] text-white rounded-full mb-6">
              YPAG
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl text-white leading-tight"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Young People&apos;s
              <br />
              Advisory Group
              <span className="block mt-2 h-1 w-24 bg-[#E8581A] rounded-full" />
            </h1>
            <p
              className="mt-8 text-xl text-zinc-400 leading-relaxed max-w-2xl"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Engaging challenges to inspire the next generation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About */}
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
              About the Programme
            </h2>
            <p
              className="text-lg text-zinc-600 leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              The YPAG brings together exceptional young people from across the
              UK to engage in real policy challenges and offer a young
              perspective on the work we do to amplify the voices of Black
              communities in national conversations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What You'll Gain */}
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
            What You&apos;ll Gain
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {gains.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4 bg-white rounded-xl p-6 shadow-sm"
              >
                <CheckCircle className="w-6 h-6 text-[#E8581A] flex-shrink-0 mt-0.5" />
                <p
                  className="text-zinc-700 leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className="text-3xl md:text-4xl text-[#0A0A0A] mb-6"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                How to Apply
              </h2>
              <p
                className="text-zinc-600 leading-relaxed mb-8"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Applications for the 2026-27 cohort open in September 2026.
                Successful candidates will be notified by November 2026.
              </p>
              <Button
                asChild
                className="h-12 px-8 rounded-md bg-[#E8581A] text-white text-base font-medium hover:bg-[#C44A13]"
              >
                <Link href="/contact?type=programmes">Apply Now</Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <h3
                className="text-xl text-[#0A0A0A] mb-6 font-semibold"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Eligibility Criteria
              </h3>
              <ul className="space-y-4">
                {eligibility.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-[#E8581A] flex-shrink-0 mt-0.5" />
                    <span
                      className="text-zinc-600"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-[#0A0A0A] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Quote className="w-10 h-10 text-[#E8581A] mx-auto mb-8" />
            <blockquote
              className="text-2xl md:text-3xl text-white leading-relaxed mb-8"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              &ldquo;Being part of the YPAG transformed how I see my role in
              policy. I went from feeling like politics wasn&apos;t for people
              like me to presenting recommendations to parliamentarians.&rdquo;
            </blockquote>
            <p
              className="text-zinc-400"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              — YPAG Member, 2024-25 Cohort
            </p>
          </motion.div>
        </div>
      </section>

      {/* Advisory Contacts */}
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
            Programme Co-Leads
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl">
            {[
              { name: "Diontre Davis", role: "YPAG Co-Lead" },
              { name: "Nadjah Osman", role: "YPAG Co-Lead" },
            ].map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="w-12 h-12 rounded-full bg-[#E8581A]/10 flex items-center justify-center mb-4">
                  <span className="text-[#E8581A] font-semibold text-lg">
                    {person.name[0]}
                  </span>
                </div>
                <h3
                  className="text-lg font-semibold text-[#0A0A0A]"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {person.name}
                </h3>
                <p
                  className="text-zinc-500 text-sm"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {person.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
