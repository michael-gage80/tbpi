"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useAsync } from "@/components/staff/use-async";
import { fetchSystemStatus } from "@/lib/org/callables";
import { useSecurity } from "@/components/staff/security";
import { cn } from "@/lib/utils";

type Tone = "green" | "amber" | "red";
const TONE: Record<Tone, string> = { green: "#22C55E", amber: "#E8951A", red: "#D8392B" };

interface Node {
  id: string;
  label: string;
  tone: Tone;
  href: string;
  x: number;
  y: number;
}

function layout(count: number): { x: number; y: number }[] {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2;
    return { x: 50 + 37 * Math.cos(a), y: 50 + 33 * Math.sin(a) };
  });
}

export function Constellation() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { data } = useAsync(fetchSystemStatus);
  const { summary: security } = useSecurity();

  const raw: Omit<Node, "x" | "y">[] = [];
  (data?.vercel ?? []).forEach((v) =>
    raw.push({
      id: `v-${v.id}`,
      label: v.name,
      tone: v.state === "ready" ? "green" : v.state === "error" ? "red" : "amber",
      href: `/ops/analytics/website/${encodeURIComponent(v.id)}`,
    })
  );
  (data?.repos ?? []).forEach((r) =>
    raw.push({
      id: `r-${r.fullName}`,
      label: r.fullName.split("/").pop() ?? r.fullName,
      tone: r.checksPass ? "green" : "amber",
      href: `/ops/analytics/github/${encodeURIComponent(r.fullName.split("/").pop() ?? "")}`,
    })
  );
  raw.push({ id: "security", label: "Security", tone: security.tone, href: "/ops/analytics/security" });
  raw.push({ id: "search", label: "Search", tone: "green", href: "/ops/analytics/search" });
  if (data?.zoho)
    raw.push({ id: "zoho", label: "Mail", tone: data.zoho.operational ? "green" : "red", href: "/ops/analytics/zoho" });

  const pos = layout(raw.length);
  const nodes: Node[] = raw.map((n, i) => ({ ...n, ...pos[i] }));

  return (
    <div className="relative aspect-[16/10] w-full">
      {/* Connecting lines to the central hub */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
        {nodes.map((n) => (
          <motion.line
            key={n.id}
            x1={50}
            y1={50}
            x2={n.x}
            y2={n.y}
            stroke="color-mix(in srgb, var(--primary) 22%, transparent)"
            strokeWidth={0.25}
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        ))}
      </svg>

      {/* Central hub */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex size-12 items-center justify-center rounded-full ops-glass shadow-card">
          <span className="text-sm font-normal text-primary" style={{ fontFamily: "var(--font-dm-serif)" }}>TBPI</span>
        </div>
      </div>

      {/* Nodes */}
      {nodes.map((n, i) => (
        <motion.button
          key={n.id}
          onClick={() => router.push(n.href)}
          className="group absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
          initial={reduce ? false : { opacity: 0, scale: 0 }}
          animate={
            reduce
              ? { opacity: 1, scale: 1 }
              : { opacity: 1, scale: 1, y: [0, i % 2 ? -4 : 4, 0] }
          }
          transition={{
            opacity: { delay: 0.4 + i * 0.06 },
            scale: { delay: 0.4 + i * 0.06, type: "spring", stiffness: 200, damping: 14 },
            y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut" },
          }}
          whileHover={{ scale: 1.25 }}
        >
          <span
            className="block size-3.5 rounded-full ops-anim"
            style={{ backgroundColor: TONE[n.tone], boxShadow: `0 0 12px ${TONE[n.tone]}`, animation: n.tone === "red" ? "tbpiLed 1.4s ease-in-out infinite" : undefined }}
          />
          <span
            className={cn(
              "pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-0.5 text-[10px] font-medium text-background opacity-0 transition-opacity group-hover:opacity-100"
            )}
          >
            {n.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
