"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Orange area sparkline that draws itself in on mount. */
export function Sparkline({
  data,
  width = 240,
  height = 64,
  strokeWidth = 2.5,
  fill = true,
  className,
}: {
  data: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  fill?: boolean;
  className?: string;
}) {
  const gradId = useId();
  const reduce = useReducedMotion();
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pad = strokeWidth;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const step = w / (data.length - 1);

  const pts = data.map((v, i) => [pad + i * step, pad + h - ((v - min) / span) * h] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${(pad + w).toFixed(1)},${(pad + h).toFixed(1)} L${pad.toFixed(1)},${(pad + h).toFixed(1)} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-full w-full overflow-visible", className)}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && (
        <motion.path
          d={area}
          fill={`url(#${gradId})`}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
      )}
      <motion.path
        d={line}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}
