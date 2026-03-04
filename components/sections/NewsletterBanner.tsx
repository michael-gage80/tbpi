"use client";

import { motion } from "framer-motion";
import { NewsletterForm } from "@/components/NewsletterForm";

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

          <NewsletterForm variant="banner" />
        </motion.div>
      </div>
    </section>
  );
}
