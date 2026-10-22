"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

const NAV_OFFSET = -96;

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Native scroll for people who ask for less motion; touch stays native anyway.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      autoRaf: true,
      anchors: { offset: NAV_OFFSET },
      stopInertiaOnNavigate: true,
    });
    window.__lenis = lenis;

    return () => {
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  // New page: start at the top, or at the #hash when the link carried one.
  useEffect(() => {
    const hash = window.location.hash;
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(target ?? 0, { immediate: true, offset: target ? NAV_OFFSET : 0 });
    } else if (target) {
      target.scrollIntoView();
    }
  }, [pathname]);

  return null;
}

// Pause smooth scrolling while a modal (e.g. the mobile menu) owns the screen.
export function setSmoothScrollPaused(paused: boolean) {
  const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
  if (!lenis) return;
  if (paused) lenis.stop();
  else lenis.start();
}
