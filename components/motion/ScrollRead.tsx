"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollReadProps {
  text: string;
  /** Phrase to set in italic orange, underlined as the reading finishes */
  accent?: string;
  className?: string;
}

// A statement that "reads itself": each word brightens as the paragraph scrolls
// through the viewport, and the accent phrase is underlined at the end.
export function ScrollRead({ text, accent, className }: ScrollReadProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 45%"],
  });

  const words = text.split(/\s+/);
  const accentWords = accent ? accent.split(/\s+/) : [];
  const accentStart = findPhrase(words, accentWords);
  const underline = useTransform(scrollYProgress, [0.85, 1], [0, 1]);

  return (
    <p ref={ref} className={cn("font-heading", className)}>
      {words.map((word, i) => {
        const inAccent = accentStart >= 0 && i >= accentStart && i < accentStart + accentWords.length;
        const start = (i / words.length) * 0.85;
        const content = inAccent ? <em className="accent">{word}</em> : word;
        return (
          <span key={i}>
            {reduce ? (
              <span>{content}</span>
            ) : (
              <Word progress={scrollYProgress} range={[start, start + 0.15]}>
                {content}
              </Word>
            )}
            {i < words.length - 1 ? " " : null}
          </span>
        );
      })}
      {accentStart >= 0 && !reduce && (
        <motion.span
          aria-hidden
          className="block h-[3px] w-24 mt-8 bg-[#E8581A] origin-left"
          style={{ scaleX: underline }}
        />
      )}
    </p>
  );
}

function Word({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: React.ReactNode;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

function findPhrase(words: string[], phrase: string[]) {
  if (!phrase.length) return -1;
  const clean = (w: string) => w.replace(/[.,;:!?]+$/, "").toLowerCase();
  for (let i = 0; i + phrase.length <= words.length; i++) {
    if (phrase.every((p, j) => clean(words[i + j]) === clean(p))) return i;
  }
  return -1;
}
