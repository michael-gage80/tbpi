"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SplitText } from "@/components/motion/SplitText";
import { publications as allPublications, TOPIC_COLOURS } from "@/components/sections/research/PublicationsGrid";

const publications = allPublications.slice(0, 3);

export function FeaturedPublications() {
  return (
    <section className="bg-white py-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-6 text-[#6B6B6B]" data-reveal="up">
              Research
            </p>
            <SplitText
              text="Latest research and publications"
              accent="research"
              className="text-h2 font-normal text-[#0A0A0A]"
            />
          </div>
          <Link
            href="/research"
            data-reveal="up"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-[#0A0A0A]"
          >
            <span className="link-grow">All publications</span> <ArrowRight className="nudge size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {publications.map((pub, i) => (
            <article
              key={pub.title}
              data-reveal="up"
              style={{ "--d": `${i * 0.1}s` } as React.CSSProperties}
              className="spot lift group flex flex-col rounded-2xl border border-[#E5E2DF] bg-white p-7 hover:border-[#0A0A0A]/20"
            >
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {pub.topics.map((t) => (
                  <Badge
                    key={t}
                    className="text-white"
                    style={{ backgroundColor: TOPIC_COLOURS[t] || "#E8581A" }}
                  >
                    {t}
                  </Badge>
                ))}
                <span className="text-xs text-zinc-500">{pub.type}</span>
              </div>
              <h3 className="font-heading text-[1.4rem] leading-snug text-[#0A0A0A]">{pub.title}</h3>
              <p className="mt-2 text-sm text-zinc-500">
                {pub.author} &middot; {pub.date}
              </p>
              <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-zinc-600">{pub.abstract}</p>
              <Link
                href="/research"
                className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-[#C44A13]"
              >
                Read more <ArrowRight className="nudge size-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
