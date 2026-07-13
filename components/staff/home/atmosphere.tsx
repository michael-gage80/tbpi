"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Time-of-day tint (very subtle, brand-warm), layered over the cream/charcoal bg.
function tintForHour(h: number): string {
  if (h < 6) return "rgba(60,40,90,0.10)"; // deep night — faint indigo warmth
  if (h < 11) return "rgba(232,140,60,0.10)"; // morning — amber
  if (h < 17) return "rgba(232,88,26,0.05)"; // day — light orange
  if (h < 20) return "rgba(216,90,40,0.12)"; // dusk — burnt orange
  return "rgba(40,30,60,0.12)"; // night
}

/**
 * Layered atmospheric backdrop for the Home showstopper: time-aware gradient,
 * faint dot-grid, film grain, breathing orange glows, and drifting specks.
 * Fixed behind the content; fully disabled under reduced motion (static tint only).
 */
export function Atmosphere() {
  const reduce = useReducedMotion();
  const [hour, setHour] = useState(12);

  useEffect(() => {
    // The local hour is client-only; reading it during render would mismatch
    // the server-rendered HTML. This decorative backdrop reads it once on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHour(new Date().getHours());
  }, []);

  const tint = tintForHour(hour);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Time-aware gradient wash */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{ background: `radial-gradient(120% 80% at 70% -10%, ${tint}, transparent 60%)` }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--foreground) 7%, transparent) 1px, transparent 0)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(120% 90% at 50% 0%, black, transparent 75%)",
        }}
      />
      {/* Breathing glows */}
      {!reduce && (
        <>
          <motion.div
            className="absolute -left-32 top-10 size-[38rem] rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 16%, transparent), transparent 65%)" }}
            animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.08, 1], x: [0, 24, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-40 top-1/3 size-[34rem] rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 12%, transparent), transparent 65%)" }}
            animate={{ opacity: [0.4, 0.7, 0.4], scale: [1.05, 1, 1.05], y: [0, -30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Floating specks */}
          {[...Array(6)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute size-1 rounded-full bg-primary/30"
              style={{ left: `${12 + i * 15}%`, top: `${20 + ((i * 37) % 60)}%` }}
              animate={{ y: [0, -18 - i * 3, 0], opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: 8 + i * 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
            />
          ))}
        </>
      )}
      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply dark:mix-blend-screen dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
