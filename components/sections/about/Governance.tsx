"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { EASE } from "@/lib/motion";

export function Governance() {
  return (
    <section id="governance" className="bg-white py-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ease: EASE, duration: 0.9 }}
          className="max-w-3xl"
        >
          <h2 className="text-h2 text-[#0A0A0A] mb-8">
            Governance
          </h2>

          <div
            className="space-y-4 text-zinc-600 text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <p>
              The Black Policy Institute is registered as a Community Interest
              Company (CIC) in England and Wales. As a CIC, our assets are
              locked for community benefit and our activities are subject to the
              community interest test, ensuring that everything we do serves the
              communities we exist to support.
            </p>
            <p>
              Our governance structure ensures transparency, accountability and
              alignment with our mission of advancing racial equity through
              evidence and community empowerment.
            </p>
          </div>

          <div className="mt-8">
            <Button asChild variant="outline" className="gap-2">
              <a
                href="/publications/TBPI%20Articles%20of%20Association.pdf"
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileDown className="size-4" />
                Download Articles of Association (PDF)
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
