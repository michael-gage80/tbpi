"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RelatedPublication {
  title: string;
  href: string;
  download?: boolean;
}

interface PolicyArea {
  number: string;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
  related: RelatedPublication[];
}

const policyAreas: PolicyArea[] = [
  {
    number: "01",
    title: "Education",
    description:
      "We examine how educational systems perpetuate racial inequality and advocate for curricula that reflect the full breadth of human history and achievement.",
    stat: "1.5%",
    statLabel: "of UK university professors are Black",
    related: [
      {
        title: "USC Policy Lab 2024: Touching the Chair",
        href:
          "/publications/TBPI%20Annenberg%20School%20for%20Communication%20Presentation%20notes%2018052024.docx",
        download: true,
      },
      {
        title: "USC Policy Lab 2025: They Do Things Differently There",
        href:
          "/publications/Workshop%20Plan_%20%22They%20Do%20Things%20Differently%20There%22.docx",
        download: true,
      },
    ],
  },
  {
    number: "02",
    title: "Employment & Economic Equity",
    description:
      "We analyse structural barriers to Black economic advancement — from hiring discrimination to wealth gaps — and develop evidence-based policy solutions.",
    stat: "20%",
    statLabel: "less earned by Black workers than white counterparts",
    related: [
      {
        title: "Shaping Equitable and Just Policies",
        href: "/publications/Shaping%20Equitable%20and%20Just%20Policies.pdf",
        download: true,
      },
    ],
  },
  {
    number: "03",
    title: "Health & Wellbeing",
    description:
      "We investigate racial health disparities across the NHS and broader health system, advocating for culturally competent care and equitable health outcomes.",
    stat: "4x",
    statLabel: "more likely for Black women to die in childbirth in the UK",
    related: [],
  },
  {
    number: "04",
    title: "Media Representation",
    description:
      "We challenge harmful stereotypes and advocate for authentic, dignified representation of Black people across British media.",
    stat: "8%",
    statLabel: "of primetime drama leading roles feature Black characters",
    related: [
      {
        title: "TBPI × CoCo Collective Kitemark Report",
        href: "/publications/TBPI%20CoCo%20Collective%20Kitemark%20Research%20Report%202024%20(1).pdf",
        download: true,
      },
      {
        title: "Shaping Equitable and Just Policies",
        href: "/publications/Shaping%20Equitable%20and%20Just%20Policies.pdf",
        download: true,
      },
    ],
  },
  {
    number: "05",
    title: "AI & Technology",
    description:
      "We explore how artificial intelligence intersects with race, and advocate for AI governance that is equitable, transparent and includes minority perspectives.",
    stat: "35%",
    statLabel: "more AI bias incidents affecting Black faces than white",
    related: [
      {
        title: "Countering Misinformation in Africa",
        href:
          "/publications/Countering%20Misinformation%20in%20Africa%3A%20Local%20Approaches%20to%20AI-Powered%20Challenges.pdf",
        download: true,
      },
    ],
  },
  {
    number: "06",
    title: "Criminal Justice & Policing",
    description:
      "We examine disproportionality in the criminal justice system — from stop and search to sentencing — and drive reform through community engagement and policy advocacy.",
    stat: "8x",
    statLabel: "more likely for Black people to be stopped and searched",
    related: [],
  },
];

function PolicyAreaCard({
  area,
  index,
}: {
  area: PolicyArea;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative bg-white rounded-xl border border-zinc-200 p-8 transition-all hover:shadow-lg"
      style={{
        borderLeft: "4px solid transparent",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderLeftColor = "#E8581A";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderLeftColor = "transparent";
      }}
    >
      {/* Number accent */}
      <span
        className="text-5xl font-bold leading-none mb-6 block"
        style={{
          color: "#E8581A",
          fontFamily: "var(--font-dm-serif)",
          opacity: 0.2,
        }}
      >
        {area.number}
      </span>

      <h3
        className="text-xl sm:text-2xl text-[#0A0A0A] mb-4"
        style={{ fontFamily: "var(--font-dm-serif)" }}
      >
        {area.title}
      </h3>

      <p
        className="text-zinc-600 text-sm leading-relaxed mb-6"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {area.description}
      </p>

      {/* Key stat */}
      <div
        className="rounded-lg p-4 mb-6"
        style={{ backgroundColor: "#F7F5F2" }}
      >
        <span
          className="text-3xl font-bold block mb-1"
          style={{ color: "#E8581A", fontFamily: "var(--font-dm-serif)" }}
        >
          {area.stat}
        </span>
        <span
          className="text-xs text-zinc-500"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {area.statLabel}
        </span>
      </div>

      {/* Related publications */}
      <div className="mb-6">
        <p
          className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Related Publications
        </p>
        {area.related.length > 0 ? (
          <ul className="space-y-1">
            {area.related.map((pub) => (
              <li key={pub.title}>
                <a
                  href={pub.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...(pub.download ? { download: true } : {})}
                  className="text-sm text-[#E8581A] hover:text-[#C44A13] transition-colors underline-offset-2 hover:underline"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {pub.title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p
            className="text-sm text-zinc-500"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            New publications coming soon.
          </p>
        )}
      </div>

      <Link
        href="/research"
        className="inline-flex items-center gap-1 text-sm font-medium transition-colors"
        style={{ color: "#E8581A", fontFamily: "var(--font-inter)" }}
      >
        Explore <ArrowRight className="size-4" />
      </Link>
    </motion.div>
  );
}

export function PolicyAreasGrid() {
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {policyAreas.map((area, i) => (
            <PolicyAreaCard key={area.number} area={area} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
