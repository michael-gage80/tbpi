"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FeaturedPublication() {
  return (
    <section style={{ backgroundColor: "#F7F5F2" }} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-8"
            style={{ color: "#E8581A", fontFamily: "var(--font-inter)" }}
          >
            Featured Publication
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-2xl bg-white p-8 sm:p-12 shadow-sm border border-zinc-100"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="bg-[#E8581A] text-white hover:bg-[#C44A13]">
                  Media
                </Badge>
                <Badge variant="outline" className="border-zinc-300 text-zinc-600">
                  Report
                </Badge>
                <span
                  className="text-xs text-zinc-500"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  2024
                </span>
              </div>

              <h2
                className="text-2xl sm:text-3xl lg:text-4xl text-[#0A0A0A] mb-4"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                CoCo Collective Kitemark 2024
              </h2>

              <p
                className="text-zinc-600 text-base sm:text-lg leading-relaxed"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                A comprehensive framework for evaluating authentic representation
                and inclusion practices within creative and cultural organisations.
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium text-white transition-all hover:brightness-90"
                style={{ backgroundColor: "#E8581A", fontFamily: "var(--font-inter)" }}
              >
                Download Report <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
