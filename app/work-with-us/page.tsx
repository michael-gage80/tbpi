"use client";

import { motion } from "framer-motion";
import {
  FileSearch,
  Users,
  BarChart3,
  UserCheck,
  Mic,
  HeartHandshake,
  Building2,
  Landmark,
  Globe,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const services = [
  {
    icon: FileSearch,
    title: "Research Commissions",
    description:
      "Bespoke, rigorous research tailored to your policy challenge — from scoping to publication-ready reports.",
  },
  {
    icon: Users,
    title: "DEI Training (Pioneers of Change)",
    description:
      "Our 22-session DEI transformation programme for organisations ready to build genuinely equitable workplaces.",
  },
  {
    icon: BarChart3,
    title: "Strategy & Policy Review",
    description:
      "Independent audit of your equality, diversity and inclusion strategies with actionable recommendations.",
  },
  {
    icon: UserCheck,
    title: "Executive Coaching",
    description:
      "1:1 coaching for senior leaders navigating race equity, inclusive leadership and organisational change.",
  },
  {
    icon: Mic,
    title: "Speaking Engagements",
    description:
      "Keynotes, panel appearances and facilitated workshops from TBPI's expert team at your events.",
  },
  {
    icon: HeartHandshake,
    title: "Community Engagement",
    description:
      "Facilitated community consultation, co-design processes and participatory research with Black communities.",
  },
];

const clients = [
  {
    icon: Building2,
    title: "Corporates",
    description:
      "FTSE companies, financial institutions and professional services firms seeking substantive DEI progress.",
    examples: "Financial services · Tech · Legal · Media",
  },
  {
    icon: Landmark,
    title: "Public Sector",
    description:
      "Government departments, local authorities, NHS trusts and arm's-length bodies driving equitable outcomes.",
    examples: "DLUHC · NHS Trusts · Local authorities · Police",
  },
  {
    icon: Globe,
    title: "NGOs & Charities",
    description:
      "Third sector organisations wanting to embed racial equity into programmes, governance and culture.",
    examples: "Foundations · Housing associations · Arts orgs",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description:
      "Universities, schools and MATs working to decolonise curricula and build inclusive environments.",
    examples: "Russell Group universities · Multi-academy trusts",
  },
];

const steps = [
  {
    num: "01",
    title: "Enquire",
    desc: "Complete our short enquiry form or drop us an email. We respond within 2 working days.",
  },
  {
    num: "02",
    title: "Scoping Call",
    desc: "A 45-minute call to understand your challenge, context and what success looks like for you.",
  },
  {
    num: "03",
    title: "Proposal",
    desc: "We'll send a tailored proposal — scope, approach, timeline and investment — within one week.",
  },
  {
    num: "04",
    title: "Delivery",
    desc: "We deliver with rigour, transparency and community accountability — and measure impact throughout.",
  },
];

const testimonials = [
  {
    quote:
      "TBPI's research gave us the evidence base we needed to make the case internally. The team were genuinely collaborative — not just consultants, but partners.",
    name: "Director of Inclusion",
    org: "Major UK Financial Institution",
  },
  {
    quote:
      "The Pioneers of Change programme transformed how our leadership team thinks about race equity. It wasn't tick-box training — it was real, uncomfortable and necessary.",
    name: "Chief People Officer",
    org: "National NHS Trust",
  },
  {
    quote:
      "Brian's keynote at our conference set the tone for the whole day. Authoritative, challenging and deeply practical.",
    name: "Programme Director",
    org: "Public Sector Leadership Forum",
  },
];

const FadeUp = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function WorkWithUsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A0A0A] pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#E8581A]" />
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full text-[#E8581A] bg-[#E8581A]/10 border border-[#E8581A]/30">
              Work With Us
            </span>
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-normal text-white leading-tight mb-6"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Commission.
              <br />
              Collaborate.
              <br />
              <span className="text-[#E8581A]">Change.</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
              We partner with organisations serious about racial equity — delivering
              research, training and strategy that creates lasting, measurable change.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Button
                asChild
                className="bg-[#E8581A] hover:bg-[#C44A13] text-white px-8 py-3 h-12"
              >
                <Link href="/contact">Commission Us</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/30 text-white bg-transparent hover:bg-white/5 px-8 py-3 h-12"
              >
                <Link href="/programmes/pioneers-of-change">
                  Pioneers of Change
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <h2
              className="text-3xl sm:text-4xl font-normal text-[#0A0A0A] mb-3"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Our Services
            </h2>
            <p className="text-[#6B6B6B] mb-10 max-w-xl">
              From bespoke research commissions to immersive DEI programmes — we
              offer a suite of services tailored to your challenge.
            </p>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <FadeUp key={s.title} delay={i * 0.08}>
                <Card className="border border-[#E5E2DF] hover:shadow-lg hover:-translate-y-1 transition-all group">
                  <CardContent className="p-6">
                    <div className="w-11 h-11 rounded-lg bg-[#E8581A]/10 group-hover:bg-[#E8581A] flex items-center justify-center mb-4 transition-colors">
                      <s.icon className="h-5 w-5 text-[#E8581A] group-hover:text-white transition-colors" />
                    </div>
                    <h3
                      className="text-lg font-normal text-[#0A0A0A] mb-2"
                      style={{ fontFamily: "var(--font-dm-serif)" }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className="text-sm text-[#6B6B6B] leading-relaxed"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {s.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Who we work with */}
      <section className="bg-[#F7F5F2] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <h2
              className="text-3xl sm:text-4xl font-normal text-[#0A0A0A] mb-3"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Who We Work With
            </h2>
            <p className="text-[#6B6B6B] mb-10 max-w-xl">
              We work with organisations across sectors that are committed to
              substantive — not performative — change.
            </p>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {clients.map((c, i) => (
              <FadeUp key={c.title} delay={i * 0.08}>
                <div className="bg-white rounded-xl p-6 border border-[#E5E2DF] h-full">
                  <div className="w-10 h-10 rounded-lg bg-[#0A0A0A] flex items-center justify-center mb-4">
                    <c.icon className="h-5 w-5 text-[#E8581A]" />
                  </div>
                  <h3
                    className="text-lg font-normal text-[#0A0A0A] mb-2"
                    style={{ fontFamily: "var(--font-dm-serif)" }}
                  >
                    {c.title}
                  </h3>
                  <p
                    className="text-sm text-[#6B6B6B] leading-relaxed mb-3"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {c.description}
                  </p>
                  <p className="text-xs text-[#E8581A] font-medium">
                    {c.examples}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <h2
              className="text-3xl sm:text-4xl font-normal text-[#0A0A0A] mb-10 text-center"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              How We Work
            </h2>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <FadeUp key={step.num} delay={i * 0.1}>
                <div className="relative">
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-5 left-[calc(100%_-_12px)] w-full h-px bg-[#E8581A]/30 z-0" />
                  )}
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-full bg-[#E8581A] text-white text-sm font-bold flex items-center justify-center mb-4">
                      {step.num}
                    </div>
                    <h3
                      className="text-lg font-normal text-[#0A0A0A] mb-2"
                      style={{ fontFamily: "var(--font-dm-serif)" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-sm text-[#6B6B6B] leading-relaxed"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#0A0A0A] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <h2
              className="text-3xl sm:text-4xl font-normal text-white mb-10"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              What Our Partners Say
            </h2>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-full flex flex-col">
                  <p
                    className="text-white/80 text-sm leading-relaxed flex-1 italic mb-6"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-white/50 text-xs">{t.org}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#E8581A] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <FadeUp>
            <h2
              className="text-3xl sm:text-4xl font-normal text-white"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Ready to work together?
            </h2>
            <p className="text-white/80 mt-2">
              Tell us about your challenge. We'll be in touch within 2 working days.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <Button
              asChild
              className="bg-white text-[#E8581A] hover:bg-white/90 px-8 py-3 h-12 font-semibold flex items-center gap-2 whitespace-nowrap"
            >
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
