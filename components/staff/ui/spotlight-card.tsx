"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Cursor-reactive card: a radial spotlight tracks the pointer and the card
 * tilts subtly toward it. Falls back to a static card under reduced-motion.
 */
export function SpotlightCard({
  children,
  className,
  glass = false,
  tilt = true,
  spotlight = true,
  onClick,
  style,
}: {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  tilt?: boolean;
  spotlight?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const rx = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 });

  const spot = useTransform(
    [mx, my],
    ([x, y]) =>
      `radial-gradient(340px circle at ${x}% ${y}%, color-mix(in srgb, var(--primary) 16%, transparent), transparent 62%)`
  );

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px * 100);
    my.set(py * 100);
    if (tilt && !reduce) {
      ry.set((px - 0.5) * 6);
      rx.set(-(py - 0.5) * 6);
    }
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={reduce ? style : { rotateX: rx, rotateY: ry, transformPerspective: 1000, ...style }}
      className={cn(
        "group relative overflow-hidden rounded-[20px] text-card-foreground transition-shadow duration-300",
        glass ? "ops-glass" : "bg-card shadow-card",
        onClick && "cursor-pointer",
        className
      )}
    >
      {spotlight && !reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spot }}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
