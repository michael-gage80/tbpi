"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { Mail, Shield, Globe, Github, Triangle } from "lucide-react";
import { useAsync } from "@/components/staff/use-async";
import { fetchSystemStatus } from "@/lib/org/callables";
import { useSecurity } from "@/components/staff/security";
import { BrandLogo } from "@/components/staff/brand-logo";
import type { LucideIcon } from "lucide-react";

type Tone = "green" | "amber" | "red";
const TONE: Record<Tone, string> = { green: "#22C55E", amber: "#E8951A", red: "#D8392B" };

interface Node {
  id: string;
  label: string;
  icon: LucideIcon;
  tone: Tone;
  stat: string;
  href: string;
  x: number;
  y: number;
}

// Fixed 5-node layout around the hub.
const POS = [
  { x: 50, y: 17 },
  { x: 83, y: 40 },
  { x: 71, y: 80 },
  { x: 29, y: 80 },
  { x: 17, y: 40 },
];

export function Constellation() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { data } = useAsync(fetchSystemStatus);
  const { summary: security } = useSecurity();
  const containerRef = useRef<HTMLDivElement>(null);
  // Monotonic key to retrigger the ripple animation on each click (a pure
  // counter, rather than Date.now(), keeps render/handler purity intact).
  const rippleSeq = useRef(0);
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  // Single hovered node — state-driven so exactly one title can show (CSS
  // :hover leaves multiple nodes "stuck" as they orbit under a parked cursor).
  const [hovered, setHovered] = useState<string | null>(null);

  // Cursor parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 120, damping: 20 });
  const py = useSpring(my, { stiffness: 120, damping: 20 });

  const vercel = data?.vercel ?? [];
  const site = vercel.find((v) => /website|tbpi/i.test(v.name)) ?? vercel[0];
  const repo = data?.repos?.[0];
  const zoho = data?.zoho;
  const allReady = vercel.length > 0 && vercel.every((v) => v.state === "ready");

  const raw: Omit<Node, "x" | "y">[] = [
    { id: "email", label: "Email", icon: Mail, tone: zoho?.operational === false ? "red" : "green", stat: `Mail · ${zoho?.operational === false ? "down" : "operational"}`, href: "/ops/email" },
    { id: "security", label: "Security", icon: Shield, tone: security.tone, stat: `Security · ${security.grade} · ${security.high} high`, href: "/ops/analytics/security" },
    { id: "website", label: "Website", icon: Globe, tone: site ? (site.state === "ready" ? "green" : site.state === "error" ? "red" : "amber") : "amber", stat: site ? `${site.name} · ${site.state} · ${site.visitors7d.toLocaleString()} visitors` : "Website", href: site ? `/ops/analytics/website/${encodeURIComponent(site.id)}` : "/ops/analytics/website" },
    { id: "github", label: "GitHub", icon: Github, tone: repo ? (repo.checksPass ? "green" : "amber") : "amber", stat: repo ? `${repo.fullName.split("/").pop()} · CI ${repo.checksPass ? "pass" : "check"}` : "GitHub", href: `/ops/analytics/github/${encodeURIComponent(repo?.fullName.split("/").pop() ?? "tbpi")}` },
    { id: "vercel", label: "Vercel", icon: Triangle, tone: allReady ? "green" : "amber", stat: `Vercel · ${vercel.filter((v) => v.state === "ready").length}/${vercel.length || 0} ready`, href: site ? `/ops/analytics/website/${encodeURIComponent(site.id)}` : "/ops/analytics" },
  ];
  const nodes: Node[] = raw.map((n, i) => ({ ...n, ...POS[i] }));

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 18);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 18);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
    setHovered(null);
  }

  function go(node: Node, e: React.MouseEvent) {
    const r = containerRef.current?.getBoundingClientRect();
    if (r && !reduce) {
      setRipple({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, key: ++rippleSeq.current });
      setTimeout(() => router.push(node.href), 260);
    } else {
      router.push(node.href);
    }
  }

  const rot = reduce ? {} : { animate: { rotate: 360 }, transition: { duration: 150, repeat: Infinity, ease: "linear" as const } };
  const counter = reduce ? {} : { animate: { rotate: -360 }, transition: { duration: 150, repeat: Infinity, ease: "linear" as const } };

  return (
    <div ref={containerRef} onPointerMove={onPointerMove} onPointerLeave={onLeave} className="relative aspect-[16/11] w-full">
      <motion.div className="absolute inset-0" style={reduce ? undefined : { x: px, y: py }}>
        <motion.div className="absolute inset-0" {...rot}>
          {/* Connections */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
            {nodes.map((n) => (
              <motion.line
                key={n.id}
                x1={50}
                y1={50}
                x2={n.x}
                y2={n.y}
                stroke={TONE[n.tone]}
                strokeOpacity={0.35}
                strokeWidth={0.3}
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                animate={reduce ? undefined : { pathLength: 1, opacity: [0.25, 0.55, 0.25] }}
                transition={{ pathLength: { duration: 1, delay: 0.2 }, opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
              />
            ))}
          </svg>

          {/* Nodes */}
          {nodes.map((n, i) => {
            const Icon = n.icon;
            return (
              <div key={n.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
                <motion.div
                  {...counter}
                  className="relative"
                  onPointerEnter={() => setHovered(n.id)}
                  onPointerLeave={() => setHovered((h) => (h === n.id ? null : h))}
                >
                  <motion.button
                    onClick={(e) => go(n, e)}
                    className="relative block"
                    initial={reduce ? false : { opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.08, type: "spring", stiffness: 200, damping: 14 }}
                    whileHover={{ scale: 1.15 }}
                  >
                    {/* Halo */}
                    {!reduce && (
                      <motion.span
                        className="absolute left-1/2 top-1/2 -z-10 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{ background: `radial-gradient(circle, ${TONE[n.tone]}55, transparent 70%)` }}
                        animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: n.tone === "red" ? 1.4 : 2.6, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}
                    <span className="flex size-7 items-center justify-center rounded-full text-white shadow-card" style={{ backgroundColor: TONE[n.tone], boxShadow: `0 0 12px ${TONE[n.tone]}` }}>
                      <Icon className="size-3.5" />
                    </span>
                  </motion.button>
                  {/* Title — only for the single hovered node */}
                  <span
                    className={`pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-[11px] font-medium text-background shadow-card transition-opacity ${
                      hovered === n.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {n.label}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Central hub (fixed, upright) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {!reduce && (
          <motion.span
            className="absolute left-1/2 top-1/2 -z-10 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-lg"
            style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 30%, transparent), transparent 70%)" }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <div className="flex h-14 w-16 items-center justify-center rounded-2xl ops-glass shadow-card">
          <BrandLogo className="h-4" />
        </div>
      </div>

      {/* Click ripple */}
      {ripple && (
        <motion.span
          key={ripple.key}
          className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary"
          style={{ left: `${ripple.x}%`, top: `${ripple.y}%` }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 10, opacity: 0 }}
          transition={{ duration: 0.5 }}
          onAnimationComplete={() => setRipple(null)}
        />
      )}
    </div>
  );
}
