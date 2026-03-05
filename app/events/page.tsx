"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ExternalLink, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

const upcomingEvents: Array<{
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "online" | "in-person";
  category: string;
  price: string;
  description: string;
  cta: string;
  ctaHref: string;
  spots: string;
}> = [];

const pastEvents = [
  {
    id: 4,
    title: "COVID Reflection: Where Are We Now?",
    date: "7 Aug 2025",
    location: "The Black Cultural Centre, London",
    type: "in-person",
    summary:
      "An evening of reflection on the pandemic's long tail, what community care taught us and how public institutions must respond to persistent racial inequities in health.",
    href:
      "https://www.eventbrite.com/e/covid-reflection-where-are-we-now-tickets-1508149909979",
  },
  {
    id: 1,
    title: "From Theory to Practice: Early Years Pedagogy in Action",
    date: "2 Aug 2025",
    location: "The Black Cultural Centre, London",
    type: "in-person",
    summary:
      "An evening with Jamel C Campbell showcasing inclusive early years pedagogy in practice and tools educators can implement immediately.",
    href:
      "https://www.eventbrite.com/e/from-theory-to-practice-early-years-pedagogy-in-action-tickets-1508162587899",
  },
  {
    id: 2,
    title: "The Future of Diversity, Equity & Inclusion: A Panel Discussion",
    date: "24 Jul 2025",
    location: "The Black Cultural Centre, London",
    type: "in-person",
    summary:
      "Leading changemakers, policymakers and community leaders reimagined what meaningful DEI commitments must look like over the next decade.",
    href:
      "https://www.eventbrite.com/e/the-future-of-diversity-equity-inclusion-a-panel-discussion-tickets-1474924562069",
  },
  {
    id: 3,
    title: "Misinformation in Digital Africa: Lessons from Kenya and Nigeria",
    date: "25 Oct 2024",
    location: "Online",
    type: "online",
    summary:
      "A roundtable with Kenyan and Nigerian researchers on tackling dangerous narratives online and strengthening community fact-checking initiatives.",
    href:
      "https://www.eventbrite.com/e/misinformation-in-digital-africa-lessons-from-kenya-and-nigeria-tickets-1043021544517",
  },
];

const filters = ["All", "Online", "In-person", "Conference", "Workshop", "Public Lecture"];

const typeColors: Record<string, string> = {
  online: "#3B82F6",
  "in-person": "#10B981",
};

const categoryColors: Record<string, string> = {
  "Policy Forum": "#8B5CF6",
  Conference: "#E8581A",
  Programme: "#0EA5E9",
  "Public Lecture": "#F59E0B",
  Workshop: "#10B981",
};

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = upcomingEvents.filter((e) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Online") return e.type === "online";
    if (activeFilter === "In-person") return e.type === "in-person";
    return e.category === activeFilter;
  });

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A0A0A] pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#E8581A]" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full text-[#E8581A] bg-[#E8581A]/10 border border-[#E8581A]/30">
              Events
            </span>
            <h1
              className="text-5xl sm:text-6xl font-normal text-white leading-tight mb-4"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Where Policy Meets{" "}
              <span className="text-[#E8581A]">Community</span>
            </h1>
            <p
              className="text-lg text-white/60 max-w-2xl"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Forums, summits and workshops bringing together policymakers,
              practitioners and communities to drive change.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <h2
              className="text-3xl font-normal text-[#0A0A0A]"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Upcoming Events
            </h2>
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    activeFilter === f
                      ? "bg-[#E8581A] text-white border-[#E8581A]"
                      : "border-[#E5E2DF] text-[#6B6B6B] hover:border-[#E8581A] hover:text-[#E8581A]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-6">
              {filtered.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="border border-[#E5E2DF] hover:shadow-md transition-shadow overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-28 bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center shrink-0">
                          <Calendar className="h-5 w-5 text-[#E8581A] mb-2" />
                          <p className="text-white text-xs font-medium leading-tight">
                            {event.date}
                          </p>
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span
                              className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                              style={{
                                backgroundColor:
                                  categoryColors[event.category] || "#6B6B6B",
                              }}
                            >
                              {event.category}
                            </span>
                            <span
                              className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                              style={{
                                backgroundColor: typeColors[event.type] || "#6B6B6B",
                              }}
                            >
                              {event.type === "online" ? "Online" : "In-person"}
                            </span>
                            {event.spots === "Limited" && (
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                                Limited Spots
                              </span>
                            )}
                          </div>
                          <h3
                            className="text-xl font-normal text-[#0A0A0A] mb-2"
                            style={{ fontFamily: "var(--font-dm-serif)" }}
                          >
                            {event.title}
                          </h3>
                          <p
                            className="text-sm text-[#6B6B6B] mb-4 leading-relaxed"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            {event.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B6B6B]">
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Users className="h-4 w-4" />
                              {event.price}
                            </span>
                          </div>
                        </div>
                        <div className="md:w-36 flex items-center justify-center p-6 border-t md:border-t-0 md:border-l border-[#E5E2DF]">
                          <Button
                            asChild
                            className="bg-[#E8581A] hover:bg-[#C44A13] text-white text-sm w-full md:w-auto"
                          >
                            <Link href={event.ctaHref}>{event.cta}</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#E5E2DF] p-8 text-center">
              <p className="text-lg text-[#0A0A0A] mb-2" style={{ fontFamily: "var(--font-dm-serif)" }}>
                No upcoming events right now
              </p>
              <p className="text-sm text-[#6B6B6B]" style={{ fontFamily: "var(--font-inter)" }}>
                Browse our recent highlights below or join the newsletter to hear about the next gathering.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className="bg-[#F7F5F2] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl font-normal text-[#0A0A0A] mb-10"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Past Events
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="border border-[#E5E2DF] bg-white h-full">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                      <span>{event.date}</span>
                      <span className="text-[#E5E2DF]">·</span>
                      <span>{event.location}</span>
                    </div>
                    <h3
                      className="text-lg font-normal text-[#0A0A0A]"
                      style={{ fontFamily: "var(--font-dm-serif)" }}
                    >
                      {event.title}
                    </h3>
                    <p
                      className="text-sm text-[#6B6B6B] leading-relaxed"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {event.summary}
                    </p>
                    <a
                      href={event.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-[#E8581A] hover:text-[#C44A13] transition-colors"
                    >
                      View on Eventbrite <ExternalLink className="size-4" />
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A0A0A] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2
            className="text-3xl sm:text-4xl font-normal text-white mb-4"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Want to partner on an event?
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            We collaborate with organisations to co-host forums, workshops and
            community events. Get in touch to explore.
          </p>
          <Button
            asChild
            className="bg-[#E8581A] hover:bg-[#C44A13] text-white px-8 py-3"
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
