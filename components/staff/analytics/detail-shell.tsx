"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";

export function DetailShell({
  eyebrow,
  title,
  right,
  children,
}: {
  eyebrow?: string;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(720px circle at 82% -2%, color-mix(in srgb, var(--primary) 9%, transparent), transparent 58%)",
        }}
      />
      <Link
        href="/ops/analytics"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Status
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
          )}
          <h1
            className="mt-1 text-4xl font-normal text-foreground sm:text-5xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            {title}
          </h1>
        </div>
        {right}
      </motion.div>
      {children}
    </div>
  );
}

export function Panel({
  title,
  children,
  className,
  action,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-[20px] bg-card p-5 shadow-card", className)}>
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-normal text-foreground" style={{ fontFamily: "var(--font-dm-serif)" }}>
            {title}
          </h2>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function HeroNumber({ value, label, delta }: { value: React.ReactNode; label: string; delta?: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-3xl font-normal text-foreground" style={{ fontFamily: "var(--font-dm-serif)" }}>
        {value}
      </p>
      {delta && <div className="mt-1">{delta}</div>}
    </div>
  );
}

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--line2)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--popover-foreground)",
};

export function AreaTrend({
  data,
  xKey,
  yKey,
  height = 220,
}: {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--line2)" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={24} />
        <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--line2)" }} />
        <Area
          type="monotone"
          dataKey={yKey}
          stroke="var(--primary)"
          strokeWidth={2.5}
          fill="url(#areaFill)"
          animationDuration={1100}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BarTrend({
  data,
  xKey,
  yKey,
  height = 200,
}: {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--line2)" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={16} />
        <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--chip)" }} />
        <Bar dataKey={yKey} fill="var(--primary)" radius={[4, 4, 0, 0]} animationDuration={1000} />
      </BarChart>
    </ResponsiveContainer>
  );
}
