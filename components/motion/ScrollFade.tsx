"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

// Hero copy sinks and dims as you scroll past it, so the page feels layered
// rather than a stack of flat blocks.
export function ScrollFade({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.25]);

  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { y, opacity }}>
      {children}
    </motion.div>
  );
}
