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
import { publications as allPublications, TOPIC_COLOURS } from "@/components/sections/research/PublicationsGrid";

const publications = allPublications.slice(0, 3);

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
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {pub.topics.map((t) => (
                      <Badge
                        key={t}
                        className="text-white"
                        style={{ backgroundColor: TOPIC_COLOURS[t] || "#E8581A" }}
                      >
                        {t}
                      </Badge>
                    ))}
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
