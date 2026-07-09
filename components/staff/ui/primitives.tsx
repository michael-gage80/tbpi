"use client";

import { cn } from "@/lib/utils";

/* Pulsing status LED (green = operational, amber = degraded, red = down). */
export function Led({
  tone = "green",
  className,
}: {
  tone?: "green" | "amber" | "red";
  className?: string;
}) {
  const color =
    tone === "green" ? "#22C55E" : tone === "amber" ? "#E8951A" : "#D8392B";
  return (
    <span
      className={cn("inline-block size-2 rounded-full", className)}
      style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}`, animation: "tbpiLed 2s ease-in-out infinite" }}
    />
  );
}

/* Inline orange sparkline from a series of numbers. */
export function Sparkline({
  data,
  width = 96,
  height = 28,
  className,
}: {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
}) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const step = width / (data.length - 1);
  const points = data
    .map((v, i) => `${(i * step).toFixed(1)},${(height - ((v - min) / span) * height).toFixed(1)}`)
    .join(" ");
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={className}
      aria-hidden
    >
      <polyline
        points={points}
        stroke="var(--primary)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Delta indicator, coloured by sign. */
export function Delta({ value, className }: { value?: number | null; className?: string }) {
  if (value == null || Number.isNaN(value)) return null;
  const positive = value >= 0;
  return (
    <span
      className={cn("text-xs font-semibold", className)}
      style={{ color: positive ? "#1F9D55" : "#D8392B" }}
    >
      {positive ? "▲" : "▼"} {Math.abs(value).toFixed(0)}%
    </span>
  );
}

const CATEGORY_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  event: { color: "#E8581A", bg: "rgba(232,88,26,.14)", label: "Event" },
  meeting: { color: "var(--foreground)", bg: "var(--muted)", label: "Meeting" },
  deadline: { color: "#D8392B", bg: "rgba(216,57,43,.14)", label: "Deadline" },
  high: { color: "#D8392B", bg: "rgba(216,57,43,.14)", label: "High" },
  medium: { color: "#E8581A", bg: "rgba(232,88,26,.14)", label: "Medium" },
  low: { color: "#8E8E93", bg: "rgba(142,142,147,.16)", label: "Low" },
};

export function Chip({ kind, className }: { kind: string; className?: string }) {
  const s = CATEGORY_STYLES[kind];
  if (!s) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        className
      )}
      style={{ color: s.color, backgroundColor: s.bg }}
    >
      {s.label}
    </span>
  );
}
