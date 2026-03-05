"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroCanvas } from "@/components/sections/HeroCanvas";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-[#0A0A0A] pt-20 overflow-hidden">
      <HeroCanvas />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.05] tracking-tight text-white"
          >
            Evidence-based policy.
            <br />
            Community-powered
            <br />
            <span className="text-[#E8581A]">change.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 max-w-2xl text-lg sm:text-xl text-zinc-400 leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            We drive racial equity through rigorous research, community
            empowerment and transformative policy development across the UK.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Button
              asChild
              className="h-12 px-8 rounded-md bg-[#E8581A] text-white text-base font-medium hover:bg-[#C44A13]"
            >
              <Link href="/work-with-us">Commission Us</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 px-8 rounded-md border-white text-white text-base font-medium bg-transparent hover:bg-white/10 hover:text-white"
            >
              <Link href="/research">Explore Research</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-6 text-zinc-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
