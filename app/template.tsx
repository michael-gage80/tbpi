"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";

// Re-mounts on every navigation. The first page load renders straight away (no
// waiting on hydration); later route changes fade the new page up into place.
let hasMounted = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const animate = hasMounted;

  useEffect(() => {
    hasMounted = true;
  }, []);

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.fast, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
