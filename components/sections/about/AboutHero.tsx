"use client";

import { motion } from "framer-motion";

export function AboutHero() {
  return (
    <section className="bg-[#0A0A0A] pt-20 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
            About The Black
            <br />
            Policy Institute
            <span className="block mt-2 h-1 w-24 bg-[#E8581A] rounded-full" />
          </h1>
          <p
            className="mt-8 text-xl text-zinc-400 leading-relaxed max-w-2xl"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            A non-partisan racial equity think tank built on evidence, community
            and change.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
