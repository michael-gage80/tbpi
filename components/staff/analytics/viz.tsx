"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Animated radial gauge (0–max). Great for perf scores / Web Vitals. */
export function RadialGauge({
  value,
  max = 100,
  label,
  unit,
  size = 120,
  tone,
}: {
  value: number | null;
  max?: number;
  label: string;
  unit?: string;
  size?: number;
  tone?: string;
}) {
  const reduce = useReducedMotion();
  const r = (size - 14) / 2;
  const C = 2 * Math.PI * r;
  const pct = value == null ? 0 : Math.max(0, Math.min(1, value / max));
  const color = tone ?? (pct >= 0.9 ? "#22C55E" : pct >= 0.5 ? "#E8581A" : "#D8392B");
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="size-full -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line2)" strokeWidth="8" />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={reduce ? false : { strokeDashoffset: C }}
            whileInView={{ strokeDashoffset: C * (1 - pct) }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-normal text-foreground" style={{ fontFamily: "var(--font-dm-serif)" }}>
            {value == null ? "—" : value}
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </span>
        </div>
      </div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

/** Animated ranked bar list (top pages, queries, referrers…). */
export function RankList({
  rows,
  valueFormat = (v) => v.toLocaleString(),
  className,
}: {
  rows: { label: string; value: number; href?: string | null }[];
  valueFormat?: (v: number) => string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (!rows?.length) return <p className="text-sm text-muted-foreground">No data.</p>;
  const max = Math.max(...rows.map((r) => r.value)) || 1;
  return (
    <ul className={cn("space-y-2.5", className)}>
      {rows.map((row, i) => (
        <li key={row.label + i} className="relative">
          <div className="relative flex items-center justify-between gap-3 overflow-hidden rounded-lg px-3 py-2">
            <motion.span
              aria-hidden
              className="absolute inset-y-0 left-0 rounded-lg bg-primary/10"
              initial={reduce ? false : { width: 0 }}
              whileInView={{ width: `${(row.value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            />
            <span className="relative z-10 min-w-0 truncate text-sm text-foreground">{row.label}</span>
            <span className="relative z-10 shrink-0 text-sm font-semibold text-foreground">
              {valueFormat(row.value)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Animated donut for a small distribution (devices, severity…). */
export function Donut({
  segments,
  size = 132,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const reduce = useReducedMotion();
  const gid = useId();
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const r = (size - 16) / 2;
  const C = 2 * Math.PI * r;
  const dashes = segments.map((s) => (s.value / total) * C);
  const offsets = dashes.map((_, i) => dashes.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <div className="flex items-center gap-5">
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90 shrink-0" style={{ width: size, height: size }}>
        {segments.map((s, i) => (
          <motion.circle
            key={s.label + gid}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="14"
            strokeDasharray={`${dashes[i]} ${C - dashes[i]}`}
            strokeDashoffset={-offsets[i]}
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          />
        ))}
      </svg>
      <ul className="space-y-1.5">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-sm">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-muted-foreground">{s.label}</span>
            <span className="font-semibold text-foreground">{s.value.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
