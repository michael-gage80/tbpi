"use client";

import { motion } from "framer-motion";
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

const publications = [
  {
    tag: "Media",
    type: "Report",
    title: "CoCo Collective Kitemark 2024",
    authors: "TBPI Research Team",
    date: "2024",
    description:
      "An evaluation framework for media representation, assessing diversity and inclusion standards across UK broadcasting.",
  },
  {
    tag: "Education",
    type: "Policy Brief",
    title: "Future Global Leaders: A Policy Framework",
    authors: "Brian Channer",
    date: "2024",
    description:
      "A comprehensive policy framework for nurturing the next generation of global leaders from underrepresented communities.",
  },
  {
    tag: "AI & Tech",
    type: "White Paper",
    title: "AI & Africa: Shaping the Digital Future",
    authors: "Ethan Ward",
    date: "2024",
    description:
      "Examining the intersection of artificial intelligence and African development, with policy recommendations for equitable digital futures.",
  },
];

export function FeaturedPublications() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h2 className="text-3xl sm:text-4xl text-[#0A0A0A]">
            Latest Research &amp; Publications
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {publications.map((pub, i) => (
            <motion.div
              key={pub.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Card className="h-full border-zinc-200 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-[#E8581A] text-white hover:bg-[#C44A13]">
                      {pub.tag}
                    </Badge>
                    <span
                      className="text-xs text-zinc-500"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {pub.type}
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-snug">
                    {pub.title}
                  </CardTitle>
                  <CardDescription
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {pub.authors} &middot; {pub.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p
                    className="text-sm text-zinc-600 line-clamp-2"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {pub.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link
                    href="/research"
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#E8581A] hover:text-[#C44A13] transition-colors"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Read More <ArrowRight className="size-4" />
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
