"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/lib/motion";

const stats = [
  { value: 2500, suffix: "+", label: "People reached" },
  { value: 36, suffix: "", label: "FGLP fellows" },
  { value: 10, suffix: "+", label: "Institutional partners" },
  { value: 8, suffix: "+", label: "Publications" },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 2.2,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString("en-GB")}
      <span className="text-[#E8581A]">{suffix}</span>
    </span>
  );
}

export function ImpactNumbers() {
  return (
    <section className="grain bg-[#0A0A0A] py-section text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <p className="eyebrow mb-12 text-white/50" data-reveal="up">
          In numbers
        </p>
        <dl className="grid grid-cols-2 gap-y-12 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              data-reveal="up"
              style={{ "--d": `${i * 0.1}s` } as React.CSSProperties}
              className="flex flex-col border-l border-white/15 pl-6 lg:pl-8"
            >
              <dt className="order-2 mt-3 text-sm text-white/55">{stat.label}</dt>
              <dd className="font-heading text-numeral">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
