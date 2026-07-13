"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Linkedin, Globe, Mail, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeading } from "@/components/staff/ui/page-heading";
import { initials } from "@/components/staff/dashboard-shell";
import type { ProfileLink } from "@/lib/firebase/types";

interface DirectoryProfile {
  uid: string;
  email: string;
  displayName: string;
  title: string;
  photoURL: string | null;
  bio: string;
  pronouns: string;
  location: string;
  startDate: string;
  askMeAbout: string[];
  links: ProfileLink[];
}

function tenure(startDate?: string): string | null {
  if (!startDate || !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) return null;
  const d = new Date(startDate);
  if (Number.isNaN(d.getTime())) return null;
  return `Joined ${format(d, "MMM yyyy")}`;
}

function linkIcon(label: string) {
  if (/linkedin/i.test(label)) return Linkedin;
  return Globe;
}

function Tag({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-chip px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}

function MemberCard({ p, onOpen }: { p: DirectoryProfile; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col items-center rounded-2xl border border-border bg-card p-5 text-center shadow-card transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <Avatar className="size-16">
        {p.photoURL && <AvatarImage src={p.photoURL} alt={p.displayName} />}
        <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
          {initials(p.displayName || p.email)}
        </AvatarFallback>
      </Avatar>
      <p className="mt-3 text-sm font-semibold text-foreground">{p.displayName || p.email}</p>
      {p.title && <p className="mt-0.5 text-xs text-muted-foreground">{p.title}</p>}
      {p.pronouns && <p className="mt-0.5 text-[11px] text-muted-foreground/70">{p.pronouns}</p>}
    </button>
  );
}

function MemberDetail({ p, onClose }: { p: DirectoryProfile | null; onClose: () => void }) {
  const joined = tenure(p?.startDate);
  return (
    <Dialog open={!!p} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        {p && (
          <>
            <DialogHeader>
              <DialogTitle className="sr-only">{p.displayName}</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-4">
              <Avatar className="size-20">
                {p.photoURL && <AvatarImage src={p.photoURL} alt={p.displayName} />}
                <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                  {initials(p.displayName || p.email)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h2 className="text-2xl font-normal text-foreground" style={{ fontFamily: "var(--font-dm-serif)" }}>
                  {p.displayName || p.email}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
                  {p.title && <span>{p.title}</span>}
                  {p.pronouns && <span className="text-muted-foreground/70">· {p.pronouns}</span>}
                </div>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {p.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" /> {p.location}
                </span>
              )}
              {joined && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" /> {joined}
                </span>
              )}
            </div>

            {p.bio && <p className="mt-4 text-sm leading-relaxed text-foreground/90">{p.bio}</p>}

            {p.askMeAbout.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">Ask me about</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.askMeAbout.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
              <a
                href={`mailto:${p.email}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
              >
                <Mail className="size-4" /> Email
              </a>
              {p.links.map((l) => {
                const Icon = linkIcon(l.label);
                return (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon className="size-4" /> {l.label}
                  </a>
                );
              })}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function DirectoryClient() {
  const [profiles, setProfiles] = useState<DirectoryProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DirectoryProfile | null>(null);

  useEffect(() => {
    fetch("/api/profiles")
      .then((r) => r.json())
      .then((d) => setProfiles((d.profiles ?? []) as DirectoryProfile[]))
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(
    () => [...profiles].sort((a, b) => (a.displayName || a.email).localeCompare(b.displayName || b.email)),
    [profiles]
  );

  return (
    <div>
      <PageHeading title="Team Directory" subtitle="The people behind TBPI. Tap a card to learn more." />

      {loading ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Loading the team…</p>
      ) : sorted.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">No team profiles yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {sorted.map((p) => (
            <MemberCard key={p.uid} p={p} onOpen={() => setSelected(p)} />
          ))}
        </div>
      )}

      <MemberDetail p={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
