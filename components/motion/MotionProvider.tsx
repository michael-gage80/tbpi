"use client";

import { MotionConfig } from "framer-motion";
import { EASE, DURATION } from "@/lib/motion";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Interactions } from "@/components/motion/Interactions";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: DURATION.base, ease: EASE }}>
      <SmoothScroll />
      <Interactions />
      {children}
    </MotionConfig>
  );
}
