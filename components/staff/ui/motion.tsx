"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  animate,
  useMotionValue,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";

/** Count-up number that animates once on scroll-into-view. */
export function AnimatedNumber({
  value,
  format = (v) => Math.round(v).toLocaleString(),
  duration = 1.3,
  className,
}: {
  value: number;
  format?: (v: number) => string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(0);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      if (ref.current) ref.current.textContent = format(value);
      return;
    }
    const controls = animate(mv, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(v);
      },
    });
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, reduce]);

  return (
    <span ref={ref} className={className}>
      {format(0)}
    </span>
  );
}

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

/** Staggered container — children should be <Reveal>. */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  );
}

/** A single revealing item. Use inside <Stagger> or standalone. */
export function Reveal({
  children,
  className,
  standalone = false,
}: {
  children: ReactNode;
  className?: string;
  standalone?: boolean;
}) {
  return (
    <motion.div
      variants={revealVariants}
      {...(standalone ? { initial: "hidden", animate: "show" } : {})}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
