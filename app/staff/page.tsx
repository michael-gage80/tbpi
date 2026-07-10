"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LayoutDashboard, Coffee, ArrowRight } from "lucide-react";

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

export default function StaffLandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A0A0A] pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#E8581A]" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full text-[#E8581A] bg-[#E8581A]/10 border border-[#E8581A]/30">
              Staff
            </span>
            <h1
              className="text-5xl sm:text-6xl font-normal text-white leading-tight mb-4"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Staff <span className="text-[#E8581A]">area</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              Tools and spaces for the TBPI team. Choose where you&apos;re headed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Options */}
      <section className="bg-[#F7F5F2] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2">
          {/* Staff Room — coming soon */}
          <FadeUp>
            <div className="h-full rounded-2xl border border-[#E5E2DF] bg-white/60 p-8 opacity-70">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#0A0A0A]/5">
                  <Coffee className="size-6 text-[#6B6B6B]" />
                </div>
                <span className="rounded-full border border-[#E5E2DF] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#6B6B6B]">
                  Coming soon
                </span>
              </div>
              <h2
                className="text-2xl font-normal text-[#0A0A0A]"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                Staff Room
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#6B6B6B]">
                A shared space for the team — resources, culture and connection. We&apos;re still
                building it.
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#9A9A9A]">
                Not available yet
              </span>
            </div>
          </FadeUp>

          {/* Operations Dashboard */}
          <FadeUp delay={0.08}>
            <Link
              href="/ops"
              className="group block h-full rounded-2xl border border-[#E5E2DF] bg-white p-8 transition-all hover:border-[#E8581A]/40 hover:shadow-md"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#E8581A]/10">
                  <LayoutDashboard className="size-6 text-[#E8581A]" />
                </div>
                <ArrowRight className="size-5 text-[#E8581A] transition-transform group-hover:translate-x-1" />
              </div>
              <h2
                className="text-2xl font-normal text-[#0A0A0A]"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                Operations Dashboard
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#6B6B6B]">
                Shared tasks, calendar and announcements, plus live org analytics. Staff sign-in
                required.
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#E8581A]">
                Open dashboard
                <ArrowRight className="size-4" />
              </span>
            </Link>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
