"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Pulsing status LED (green = operational, amber = degraded, red = down). */
export function Led({
  tone = "green",
  className,
}: {
  tone?: "green" | "amber" | "red";
  className?: string;
}) {
  const color = tone === "green" ? "#22C55E" : tone === "amber" ? "#E8951A" : "#D8392B";
  return (
    <span
      className={cn("inline-block size-2 shrink-0 rounded-full ops-anim", className)}
      style={{
        backgroundColor: color,
        boxShadow: `0 0 8px ${color}`,
        animation: "tbpiLed 2s ease-in-out infinite",
      }}
    />
  );
}

/* Green/amber status pill with LED, e.g. "All systems operational". */
export function StatusPill({
  tone = "green",
  children,
  className,
}: {
  tone?: "green" | "amber" | "red";
  children: ReactNode;
  className?: string;
}) {
  const text = tone === "green" ? "#1F9D55" : tone === "amber" ? "#B26B00" : "#D8392B";
  const bg =
    tone === "green"
      ? "rgba(34,197,94,.14)"
      : tone === "amber"
        ? "rgba(232,149,26,.14)"
        : "rgba(216,57,43,.14)";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
        className
      )}
      style={{ color: text, backgroundColor: bg }}
    >
      <Led tone={tone} />
      {children}
    </span>
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

/* Small stat tile: big serif number over a muted caption. */
export function StatTile({
  value,
  label,
  className,
  accent = false,
}: {
  value: ReactNode;
  label: string;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div className={cn("rounded-2xl bg-chip/60 p-3", className)}>
      <p
        className={cn("text-2xl font-normal leading-none", accent && "text-primary")}
        style={{ fontFamily: "var(--font-dm-serif)" }}
      >
        {value}
      </p>
      <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

const CATEGORY_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  event: { color: "#E8581A", bg: "rgba(232,88,26,.14)", label: "Event" },
  meeting: { color: "var(--foreground)", bg: "var(--chip)", label: "Meeting" },
  deadline: { color: "#D8392B", bg: "rgba(216,57,43,.14)", label: "Deadline" },
  high: { color: "#D8392B", bg: "rgba(216,57,43,.14)", label: "High" },
  medium: { color: "#E8581A", bg: "rgba(232,88,26,.14)", label: "Medium" },
  low: { color: "#8E8E93", bg: "rgba(142,142,147,.16)", label: "Low" },
  needsReply: { color: "#E8581A", bg: "rgba(232,88,26,.14)", label: "Needs reply" },
  fyi: { color: "#8E8E93", bg: "rgba(142,142,147,.16)", label: "FYI" },
  waiting: { color: "#3B82F6", bg: "rgba(59,130,246,.16)", label: "Waiting" },
};

export function Chip({
  kind,
  label,
  className,
}: {
  kind: string;
  label?: string;
  className?: string;
}) {
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
      {label ?? s.label}
    </span>
  );
}
