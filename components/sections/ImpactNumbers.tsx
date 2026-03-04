"use client";

import { motion, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 2500, suffix: "+", label: "People Reached" },
  { value: 36, suffix: "", label: "FGLP Fellows" },
  { value: 10, suffix: "+", label: "Institutional Partners" },
  { value: 8, suffix: "+", label: "Publications" },
];

function AnimatedNumber({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const controls = animate(0, value, {
            duration: 2,
            ease: "easeOut",
            onUpdate: (v) => setDisplay(Math.round(v)),
          });
          return () => controls.stop();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function ImpactNumbers() {
  return (
    <section className="bg-[#0A0A0A] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#E8581A] mb-2">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <p
                className="text-zinc-400 text-sm sm:text-base"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
