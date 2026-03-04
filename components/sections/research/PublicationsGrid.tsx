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
  "AI & Tech": "#0891B2",
  Media: "#7C3AED",
  Education: "#2563EB",
  Policy: "#059669",
  "Equity & Economics": "#CA8A04",
};

interface Publication {
  title: string;
  topics: string[];
  type: string;
  date: string;
  author: string;
  abstract: string;
}

export const publications: Publication[] = [
  {
    title: "Countering Misinformation in Africa: Local Approaches to AI-Powered Challenges",
    topics: ["AI & Tech"],
    type: "White Paper",
    date: "2025",
    author: "Ethan Ward & Chimdi Igwe",
    abstract:
      "Examining how African communities and institutions are developing locally-grounded strategies to counter AI-powered misinformation, with policy recommendations for platform accountability and digital resilience.",
  },
  {
    title: "USC Policy Lab 2025: They Do Things Differently There",
    topics: ["Education"],
    type: "Presentation",
    date: "2025",
    author: "The Black Policy Institute",
    abstract:
      "A presentation delivered at the USC Policy Lab exploring divergent approaches to racial equity policy and what the UK can learn from international models of institutional change.",
  },
  {
    title: "USC Policy Lab 2024: Touching the Chair",
    topics: ["Education"],
    type: "Presentation",
    date: "2024",
    author: "The Black Policy Institute",
    abstract:
      "A presentation delivered at the USC Policy Lab examining proximity to power — how Black-led organisations access, influence and sustain presence within policymaking institutions.",
  },
  {
    title: "Kitemark",
    topics: ["Equity & Economics"],
    type: "Report",
    date: "2024",
    author: "The Black Policy Institute",
    abstract:
      "In collaboration with CoCo Collective, this report establishes a kitemark framework for evaluating authentic representation and inclusion practices within creative and cultural organisations.",
  },
  {
    title: "The Hidden Million",
    topics: ["Policy"],
    type: "Policy Brief",
    date: "2024",
    author: "Mike Gage",
    abstract:
      "A policy brief surfacing the one million Black British citizens whose experiences and needs remain systematically absent from national policy frameworks, with recommendations to close the gap.",
  },
  {
    title: "Shaping Equitable and Just Policies",
    topics: ["Media", "Policy"],
    type: "Report",
    date: "2024",
    author: "Mike Gage",
    abstract:
      "An examination of the frameworks and mechanisms needed to design and implement policies that deliver equitable and just outcomes for Black and minoritised communities in the UK.",
  },
];

const TOPICS = ["All", "AI & Tech", "Education", "Equity & Economics", "Media", "Policy"];

const TYPES = ["All", "White Paper", "Presentation", "Report", "Policy Brief"];

export function PublicationsGrid() {
  const [activeTopic, setActiveTopic] = useState("All");
  const [activeType, setActiveType] = useState("All");

  const filtered = useMemo(() => {
    return publications.filter((p) => {
      const topicMatch = activeTopic === "All" || p.topics.includes(activeTopic);
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
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {pub.topics.map((topic) => (
                        <Badge
                          key={topic}
                          className="text-white"
                          style={{
                            backgroundColor: TOPIC_COLOURS[topic] || "#E8581A",
                          }}
                        >
                          {topic}
                        </Badge>
                      ))}
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
