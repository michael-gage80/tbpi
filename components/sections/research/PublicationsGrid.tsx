"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TOPIC_COLOURS: Record<string, string> = {
  Education: "#2563EB",
  Employment: "#059669",
  Health: "#DC2626",
  Media: "#7C3AED",
  "AI & Tech": "#0891B2",
  "Criminal Justice": "#CA8A04",
};

interface Publication {
  title: string;
  topic: string;
  type: string;
  date: string;
  author: string;
  abstract: string;
}

const publications: Publication[] = [
  {
    title: "CoCo Collective Kitemark 2024",
    topic: "Media",
    type: "Report",
    date: "Dec 2024",
    author: "TBPI Research Team",
    abstract:
      "A comprehensive framework for evaluating authentic representation and inclusion practices within creative and cultural organisations.",
  },
  {
    title: "Future Global Leaders: A Policy Framework",
    topic: "Education",
    type: "Policy Brief",
    date: "Oct 2024",
    author: "Brian Channer",
    abstract:
      "A comprehensive policy framework for nurturing the next generation of global leaders from underrepresented communities.",
  },
  {
    title: "AI & Africa: Shaping the Digital Future",
    topic: "AI & Tech",
    type: "White Paper",
    date: "Sep 2024",
    author: "Ethan Ward",
    abstract:
      "Examining the intersection of artificial intelligence and African development, with policy recommendations for equitable digital futures.",
  },
  {
    title: "Black Youth Employment: Barriers & Pathways",
    topic: "Employment",
    type: "Report",
    date: "Jul 2024",
    author: "TBPI Research Team",
    abstract:
      "Analysing structural barriers to youth employment in Black communities and proposing practical pathways to meaningful work.",
  },
  {
    title: "Criminal Justice Reform: A Community-Centred Approach",
    topic: "Criminal Justice",
    type: "Policy Brief",
    date: "May 2024",
    author: "Michael Gage",
    abstract:
      "An evidence-based policy brief advocating for community-centred reforms to address disproportionality in the criminal justice system.",
  },
  {
    title: "Health Inequalities in Black Communities",
    topic: "Health",
    type: "Report",
    date: "Mar 2024",
    author: "TBPI Research Team",
    abstract:
      "Investigating racial health disparities across the NHS, with actionable recommendations for culturally competent healthcare delivery.",
  },
  {
    title: "Decolonising the Curriculum: A Practical Guide",
    topic: "Education",
    type: "White Paper",
    date: "Jan 2024",
    author: "Brian Channer",
    abstract:
      "A practical guide for educators and institutions seeking to decolonise curricula and embed diverse perspectives across disciplines.",
  },
  {
    title: "Misogynoir in British Media",
    topic: "Media",
    type: "Policy Brief",
    date: "Nov 2023",
    author: "Nathaniel Adeleye",
    abstract:
      "Examining the intersection of anti-Black racism and sexism in British media, with recommendations for editorial accountability.",
  },
];

const TOPICS = [
  "All",
  "Education",
  "Employment",
  "Health",
  "Media",
  "AI & Tech",
  "Criminal Justice",
];

const TYPES = ["All", "Report", "Policy Brief", "White Paper"];

export function PublicationsGrid() {
  const [activeTopic, setActiveTopic] = useState("All");
  const [activeType, setActiveType] = useState("All");

  const filtered = useMemo(() => {
    return publications.filter((p) => {
      const topicMatch = activeTopic === "All" || p.topic === activeTopic;
      const typeMatch = activeType === "All" || p.type === activeType;
      return topicMatch && typeMatch;
    });
  }, [activeTopic, activeType]);

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Filter Row */}
        <div className="mb-12 space-y-4">
          {/* Topic filters */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Topic
            </p>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setActiveTopic(topic)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTopic === topic
                      ? "text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                  style={
                    activeTopic === topic
                      ? { backgroundColor: "#E8581A" }
                      : {}
                  }
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Type filters */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Type
            </p>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeType === type
                      ? "text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                  style={
                    activeType === type
                      ? { backgroundColor: "#0A0A0A" }
                      : {}
                  }
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p
          className="text-sm text-zinc-500 mb-8"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Showing {filtered.length} publication{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTopic}-${activeType}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.map((pub, i) => (
              <motion.div
                key={pub.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card className="h-full border-zinc-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        className="text-white"
                        style={{
                          backgroundColor:
                            TOPIC_COLOURS[pub.topic] || "#E8581A",
                        }}
                      >
                        {pub.topic}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-zinc-300 text-zinc-500"
                      >
                        {pub.type}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-snug">
                      {pub.title}
                    </CardTitle>
                    <CardDescription
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {pub.author} &middot; {pub.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p
                      className="text-sm text-zinc-600 line-clamp-2"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {pub.abstract}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link
                      href="#"
                      className="inline-flex items-center gap-1 text-sm font-medium transition-colors"
                      style={{
                        color: "#E8581A",
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      Download / Read <ArrowRight className="size-4" />
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p
            className="text-center text-zinc-400 py-16 text-lg"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            No publications match your filters.
          </p>
        )}
      </div>
    </section>
  );
}
