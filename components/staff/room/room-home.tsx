"use client";

import Link from "next/link";
import { Users, FolderOpen, ArrowRight, Coffee } from "lucide-react";
import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/staff/ui/spotlight-card";
import { PageHeading, SectionLabel } from "@/components/staff/ui/page-heading";
import { displayName } from "@/components/staff/dashboard-shell";
import { useMyProfile } from "@/components/staff/profile/use-profiles";
import type { LucideIcon } from "lucide-react";
import type { Session } from "@/lib/firebase/types";

const DESTINATIONS: {
  href: string;
  label: string;
  blurb: string;
  icon: LucideIcon;
}[] = [
  {
    href: "/room/directory",
    label: "Team Directory",
    blurb: "Meet the people behind TBPI — roles, pronouns, and what to ask them about.",
    icon: Users,
  },
  {
    href: "/room/resources",
    label: "Resources",
    blurb: "Brand assets, templates, policies and handbooks — everything the team needs, in one place.",
    icon: FolderOpen,
  },
];

export function RoomHome({ session }: { session: Session }) {
  const { profile } = useMyProfile();
  const name = (profile?.displayName || displayName(session.email)).split(" ")[0];

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Coffee className="size-5" />
        </span>
        <div>
          <SectionLabel>Staff Room</SectionLabel>
          <PageHeading title={`Welcome, ${name}`} subtitle="Resources, culture and connection — the human side of TBPI." />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {DESTINATIONS.map((d, i) => {
          const Icon = d.icon;
          return (
            <motion.div
              key={d.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link href={d.href} className="block h-full">
                <SpotlightCard className="h-full p-6">
                  <div className="flex h-full flex-col">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="size-6" />
                      </span>
                      <ArrowRight className="size-5 text-primary transition-transform group-hover:translate-x-1" />
                    </div>
                    <h2
                      className="text-2xl font-normal text-foreground"
                      style={{ fontFamily: "var(--font-dm-serif)" }}
                    >
                      {d.label}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {d.blurb}
                    </p>
                  </div>
                </SpotlightCard>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
