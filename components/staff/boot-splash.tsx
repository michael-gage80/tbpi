"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useFirebaseUser } from "@/components/staff/use-auth";
import { fetchSystemStatus } from "@/lib/org/callables";
import { BrandLogo } from "@/components/staff/brand-logo";

const BOOT_KEY = "tbpi_booted";
const R = 52;
const C = 2 * Math.PI * R;

/**
 * Full-screen branded loading splash shown after login + on the first dashboard
 * load of a session. A gauge fills as each core data source resolves; reveals
 * the dashboard once ready (min ~1s). Later navigations skip it.
 */
export function BootSplash() {
  const { user, ready } = useFirebaseUser();
  const reduce = useReducedMotion();
  const [hidden, setHidden] = useState(true);
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState("Starting up…");

  // Decide on mount whether to show (skip if already booted this session).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHidden(!!sessionStorage.getItem(BOOT_KEY));
  }, []);

  useEffect(() => {
    if (hidden || !ready || !user) return;
    let cancelled = false;

    // Failsafe: never let a slow/hanging callable trap the user on the splash.
    const failsafe = setTimeout(() => {
      if (cancelled) return;
      sessionStorage.setItem(BOOT_KEY, "1");
      setHidden(true);
    }, 9000);

    const steps: { label: string; run: () => Promise<unknown> }[] = [
      { label: "Checking systems…", run: () => fetchSystemStatus().catch(() => null) },
      {
        label: "Loading tasks…",
        run: () => getDocs(query(collection(db, "sharedTasks"), limit(50))).catch(() => null),
      },
      {
        label: "Loading calendar…",
        run: () => getDocs(query(collection(db, "sharedEvents"), limit(50))).catch(() => null),
      },
      {
        label: "Loading announcements…",
        run: () => getDocs(query(collection(db, "sharedAnnouncements"), limit(20))).catch(() => null),
      },
    ];

    (async () => {
      const start = Date.now();
      for (let i = 0; i < steps.length; i++) {
        if (cancelled) return;
        setLabel(steps[i].label);
        await steps[i].run();
        if (cancelled) return;
        setProgress(Math.round(((i + 1) / steps.length) * 100));
      }
      const elapsed = Date.now() - start;
      if (elapsed < 1000) await new Promise((r) => setTimeout(r, 1000 - elapsed));
      if (cancelled) return;
      setLabel("Ready");
      sessionStorage.setItem(BOOT_KEY, "1");
      setTimeout(() => !cancelled && setHidden(true), 450);
    })();

    return () => {
      cancelled = true;
      clearTimeout(failsafe);
    };
  }, [hidden, ready, user]);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          {/* Ambient orange glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(600px circle at 50% 42%, color-mix(in srgb, var(--primary) 16%, transparent), transparent 70%)",
            }}
          />

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center"
          >
            <BrandLogo className="mb-10 h-9" />

            <div className="relative size-[132px]">
              <svg viewBox="0 0 120 120" className="size-full -rotate-90">
                <circle cx="60" cy="60" r={R} fill="none" stroke="var(--line2)" strokeWidth="6" />
                <circle
                  cx="60"
                  cy="60"
                  r={R}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C * (1 - progress / 100)}
                  style={{ transition: "stroke-dashoffset 0.5s cubic-bezier(0.16,1,0.3,1)" }}
                />
              </svg>
              {/* Spinning accent arc */}
              {!reduce && (
                <svg
                  viewBox="0 0 120 120"
                  className="absolute inset-0 size-full"
                  style={{ animation: "tbpiSpin 1.1s linear infinite" }}
                  aria-hidden
                >
                  <circle
                    cx="60"
                    cy="60"
                    r={R + 10}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="18 320"
                    opacity="0.5"
                  />
                </svg>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-3xl font-normal text-foreground"
                  style={{ fontFamily: "var(--font-dm-serif)" }}
                >
                  {progress}
                  <span className="text-lg text-muted-foreground">%</span>
                </span>
              </div>
            </div>

            <motion.p
              key={label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-sm text-muted-foreground"
            >
              {label}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
