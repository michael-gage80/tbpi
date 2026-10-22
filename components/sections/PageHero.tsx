import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SplitText } from "@/components/motion/SplitText";

interface PageHeroProps {
  /** Small label above the heading */
  tag?: string;
  /** Use "\n" to force a line break */
  heading: string;
  /** Phrase within the heading to set in italic orange */
  accent?: string;
  subheading?: string;
  ctas?: { label: string; href: string; variant?: "primary" | "outline" }[];
}

// Shared hero for every inner page: the heading rises in word by word on first
// paint (pure CSS, no waiting for hydration), then the copy and actions follow.
export function PageHero({ tag, heading, accent, subheading, ctas }: PageHeroProps) {
  return (
    <section className="grain relative overflow-hidden bg-[#0A0A0A] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[15vw] -top-[20vw] size-[55vw] max-h-[900px] max-w-[900px] rounded-full opacity-50"
        style={{ background: "radial-gradient(closest-side, rgba(232,88,26,0.22), transparent)" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-36 sm:pb-24 sm:pt-44 lg:px-8">
        {tag && (
          <p className="eyebrow rise text-white/60" style={{ "--d": "0.05s" } as React.CSSProperties}>
            {tag}
          </p>
        )}
        <SplitText
          as="h1"
          trigger="load"
          delay={0.15}
          text={heading}
          accent={accent}
          className="mt-6 max-w-5xl text-h1 font-normal"
        />
        {subheading && (
          <p
            className="rise mt-8 max-w-2xl text-lede text-white/65"
            style={{ "--d": "0.6s" } as React.CSSProperties}
          >
            {subheading}
          </p>
        )}
        {ctas && ctas.length > 0 && (
          <div className="rise mt-10 flex flex-wrap gap-3" style={{ "--d": "0.75s" } as React.CSSProperties}>
            {ctas.map((cta) => (
              <Link
                key={cta.href}
                href={cta.href}
                className={
                  cta.variant === "outline"
                    ? "group inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-7 font-medium text-white transition-colors hover:border-white hover:bg-white/5"
                    : "group inline-flex h-12 items-center gap-2 rounded-full bg-[#E8581A] px-7 font-medium text-white transition-colors hover:bg-[#C44A13]"
                }
              >
                {cta.label} <ArrowRight className="nudge size-4" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div aria-hidden className="rule-draw absolute inset-x-0 bottom-0 h-px bg-white/10" style={{ "--d": "0.3s" } as React.CSSProperties} />
    </section>
  );
}
