"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterBanner() {
  return (
    <section className="bg-[#0A0A0A] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl text-white mb-4">
            Stay ahead of the policy curve
          </h2>
          <p
            className="text-zinc-400 mb-10 text-lg"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Join thousands of practitioners, policymakers and advocates
            receiving our research updates.
          </p>

          <form
            action="#"
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Your email address"
              className="h-12 bg-white/10 border-white/20 text-white placeholder:text-zinc-500 flex-1"
              style={{ fontFamily: "var(--font-inter)" }}
            />
            <Button
              type="submit"
              className="h-12 px-8 bg-[#E8581A] text-white hover:bg-[#C44A13] font-medium"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Subscribe
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
