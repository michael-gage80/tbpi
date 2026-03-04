"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface PageHeroProps {
  tag?: string;
  heading: string;
  accentWord?: string;
  subheading?: string;
  ctas?: { label: string; href: string; variant?: "primary" | "outline" }[];
}

export function PageHero({ tag, heading, accentWord, subheading, ctas }: PageHeroProps) {
  // Split heading to inject accent word if provided
  const renderHeading = () => {
    if (!accentWord) return heading;
    const parts = heading.split(accentWord);
    if (parts.length < 2) return heading;
    return (
      <>
        {parts[0]}
        <span style={{ color: "#E8581A" }}>{accentWord}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <section
      style={{ backgroundColor: "#0A0A0A" }}
      className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Orange accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: "#E8581A" }}
      />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {tag && (
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
              style={{
                color: "#E8581A",
                backgroundColor: "rgba(232, 88, 26, 0.1)",
                border: "1px solid rgba(232, 88, 26, 0.3)",
              }}
            >
              {tag}
            </span>
          )}

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-normal text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            {renderHeading()}
          </h1>

          {subheading && (
            <p
              className="text-lg sm:text-xl max-w-2xl leading-relaxed mt-4"
              style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-inter)" }}
            >
              {subheading}
            </p>
          )}

          {ctas && ctas.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-8">
              {ctas.map((cta) => (
                <Link
                  key={cta.href}
                  href={cta.href}
                  className={`inline-flex items-center px-6 py-3 rounded-md text-sm font-medium transition-all ${
                    cta.variant === "outline"
                      ? "border border-white/30 text-white hover:border-white hover:bg-white/5"
                      : "text-white hover:brightness-90"
                  }`}
                  style={
                    cta.variant !== "outline"
                      ? { backgroundColor: "#E8581A" }
                      : {}
                  }
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
