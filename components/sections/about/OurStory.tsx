"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

const milestones = [
  { year: "2020", label: "Founded" },
  { year: "2025", label: "CIC registered" },
  { year: "2026", label: "Growing impact" },
];

export function OurStory() {
  return (
    <section className="bg-[#F7F5F2] py-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ease: EASE, duration: 0.9 }}
          className="max-w-3xl"
        >
          <h2 className="text-h2 text-[#0A0A0A] mb-8">
            Our Story
          </h2>

          <div
            className="space-y-6 text-zinc-600 text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <p>
              Founded in 2020, The Black Policy Institute emerged from a
              recognition that Black communities in the UK were systematically
              underrepresented in policy conversations that directly shaped
              their lives. In the wake of a global racial reckoning, a group of
              policy professionals, academics and community leaders came
              together with a shared conviction: that lasting change requires
              more than awareness — it demands evidence, strategy and
              institutional power.
            </p>
            <p>
              From our earliest days, we committed to a model that bridges the
              gap between academic research and community experience. We
              believed that the most effective policy emerges when rigorous data
              is informed by lived reality, and when communities are not merely
              subjects of research but active participants in shaping its
              direction and application.
            </p>
            <p>
              Today, TBPI operates as a Community Interest Company, partnering
              with universities, government departments, civil society
              organisations and the private sector to produce research that
              matters, develop programmes that transform, and advocate for
              policies that deliver equity. From our Future Global Leadership
              Programme to our work on AI ethics and media representation, every
              initiative is driven by the same founding principle: that
              evidence-based policy, powered by community, is the most
              effective engine for lasting change.
            </p>
          </div>
        </motion.div>

        {/* Timeline: stacks on phones, runs across with drawing rules on wider screens */}
        <ol className="mt-16 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          {milestones.map((m, i) => (
            <li key={m.year} className="flex items-center gap-6 sm:flex-1 sm:last:flex-none">
              <div
                data-reveal="up"
                style={{ "--d": `${i * 0.25}s` } as React.CSSProperties}
                className="flex shrink-0 items-center gap-3"
              >
                <span className="size-3 rounded-full bg-[#E8581A]" />
                <span className="text-sm font-medium text-[#0A0A0A]">
                  <span className="font-heading text-lg italic">{m.year}</span> · {m.label}
                </span>
              </div>
              {i < milestones.length - 1 && (
                <div
                  aria-hidden
                  data-reveal="rule"
                  style={{ "--d": `${0.15 + i * 0.25}s` } as React.CSSProperties}
                  className="hidden h-px flex-1 bg-zinc-300 sm:block"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
