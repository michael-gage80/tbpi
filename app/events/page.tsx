"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ExternalLink, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

const upcomingEvents = [
  {
    id: 1,
    title: "Racial Equity in the NHS: A Policy Forum",
    date: "15 March 2026",
    time: "10:00 – 13:00 GMT",
    location: "Online (Zoom)",
    type: "online",
    category: "Policy Forum",
    price: "Free",
    description:
      "A cross-sector forum examining structural racism within the NHS, featuring policymakers, clinicians and community advocates. Chaired by TBPI CEO Brian Channer.",
    cta: "Register Now",
    ctaHref: "#",
    spots: "Open",
  },
  {
    id: 2,
    title: "Black Youth Employment Summit 2026",
    date: "28 March 2026",
    time: "09:00 – 17:00 GMT",
    location: "London, EC2",
    type: "in-person",
    category: "Conference",
    price: "£25",
    description:
      "A full-day summit bringing together employers, young people, educators and policymakers to tackle Black youth unemployment and build pathways to economic equity.",
    cta: "Get Tickets",
    ctaHref: "#",
    spots: "Limited",
  },
  {
    id: 3,
    title: "FGLP 2026 Cohort Launch",
    date: "12 April 2026",
    time: "18:00 – 20:30 BST",
    location: "London, SE1",
    type: "in-person",
    category: "Programme",
    price: "Invite Only",
    description:
      "The launch event for the Future Global Leadership Programme 2026 cohort. Fellows, alumni and partners gather to inaugurate the new cohort year.",
    cta: "Express Interest",
    ctaHref: "/contact?type=fglp",
    spots: "Invite Only",
  },
  {
    id: 4,
    title: "AI & Race: Community Forum",
    date: "3 May 2026",
    time: "13:00 – 16:00 BST",
    location: "Manchester, M1",
    type: "in-person",
    category: "Public Lecture",
    price: "Free",
    description:
      "An open community forum on artificial intelligence, algorithmic bias and what AI governance must do to serve Black and Brown communities. Led by Ethan Ward.",
    cta: "Register",
    ctaHref: "#",
    spots: "Open",
  },
];

const pastEvents = [
  {
    id: 1,
    title: "Black History Month Policy Symposium 2025",
    date: "October 2025",
    location: "London",
    type: "in-person",
    summary:
      "A two-day symposium marking Black History Month with policy panels, research presentations and community dialogue. Over 300 attendees from government, NGOs and civil society.",
  },
  {
    id: 2,
    title: "Decolonising Education: A National Conversation",
    date: "June 2025",
    location: "Online",
    type: "online",
    summary:
      "A virtual conference attracting 500+ educators, parents and policymakers to explore practical approaches to decolonising the UK curriculum.",
  },
  {
    id: 3,
    title: "Pioneers of Change Programme Launch",
    date: "February 2025",
    location: "London",
    type: "in-person",
    summary:
      "The inaugural launch of TBPI's Pioneers of Change DEI consultancy programme, attended by corporate partners, public sector leaders and media.",
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
                      {/* Date accent */}
                      <div className="md:w-28 bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center shrink-0">
                        <Calendar className="h-5 w-5 text-[#E8581A] mb-2" />
                        <p className="text-white text-xs font-medium leading-tight">
                          {event.date}
                        </p>
                      </div>
                      {/* Content */}
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
                              backgroundColor:
                                typeColors[event.type] || "#6B6B6B",
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
                      {/* CTA */}
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
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-[#6B6B6B]">{event.date}</span>
                      <span className="text-[#E5E2DF]">·</span>
                      <span className="text-xs text-[#6B6B6B]">{event.location}</span>
                    </div>
                    <h3
                      className="text-lg font-normal text-[#0A0A0A] mb-3"
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
