"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/** A soft ambient light that trails the cursor across the page (pointer only). */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        el.style.opacity = "1";
      });
    };
    const onLeave = () => {
      if (el) el.style.opacity = "0";
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  if (reduce) return null;
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 -z-[5] size-[420px] -translate-x-1/2 opacity-0 transition-opacity duration-500 will-change-transform"
      style={{
        marginLeft: "-210px",
        marginTop: "-210px",
        background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 10%, transparent), transparent 60%)",
      }}
    />
  );
}
