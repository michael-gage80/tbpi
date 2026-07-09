"use client";

import { format } from "date-fns";
import Link from "next/link";
import { Search, ArrowRight, Pin } from "lucide-react";
import { SpotlightCard } from "@/components/staff/ui/spotlight-card";
import { Stagger, Reveal, AnimatedNumber } from "@/components/staff/ui/motion";
import { Sparkline } from "@/components/staff/ui/sparkline";
import { Led, Delta, Chip, StatTile, StatusPill } from "@/components/staff/ui/primitives";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/components/staff/use-async";
import { fetchSystemStatus } from "@/lib/org/callables";
import {
  useSharedTasks,
  useSharedEvents,
  useSharedAnnouncements,
} from "@/components/staff/firestore-hooks";
import { OPEN_COMMAND_EVENT } from "@/components/staff/command-palette";
import { InboxCard } from "@/components/staff/email/inbox-card";
import { cn } from "@/lib/utils";
import type { Session } from "@/lib/firebase/types";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
function firstName(email: string): string {
  const n = email.split("@")[0].split(/[._-]/)[0];
  return n.charAt(0).toUpperCase() + n.slice(1);
}

const CATEGORY_SPINE: Record<string, string> = {
  event: "#E8581A",
  meeting: "var(--foreground)",
  deadline: "#D8392B",
};

function CardHeading({ title, href, cta }: { title: string; href?: string; cta?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-normal text-foreground" style={{ fontFamily: "var(--font-dm-serif)" }}>
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-transform hover:translate-x-0.5"
        >
          {cta ?? "View all"} <ArrowRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}

/* ---- Left column ---- */
function AnnouncementsCard() {
  const { data, loading } = useSharedAnnouncements();
  const sorted = [...data].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned)).slice(0, 4);
  return (
    <SpotlightCard className="p-5">
      <CardHeading title="Announcements" href="/ops/announcements" cta="All" />
      {loading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : sorted.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No announcements yet.</p>
      ) : (
        <ul>
          {sorted.map((a) => (
            <li key={a.id} className="flex items-start gap-3 border-b border-line py-3 last:border-0">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-chip/70">
                {a.pinned ? <Pin className="size-3.5 text-primary" /> : <span className="text-xs font-semibold text-muted-foreground">·</span>}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{a.title}</p>
                <p className="truncate text-xs text-muted-foreground">{a.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SpotlightCard>
  );
}

function TodayTimeline() {
  const { data, loading } = useSharedEvents();
  const today = new Date();
  const todays = data
    .filter((e) => new Date(e.start).toDateString() === today.toDateString())
    .sort((a, b) => a.start - b.start);
  return (
    <SpotlightCard className="p-5">
      <CardHeading title="Today" href="/ops/calendar" cta="Calendar" />
      {loading ? (
        <Skeleton className="h-24 w-full" />
      ) : todays.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">Nothing scheduled today.</p>
      ) : (
        <ul className="space-y-3">
          {todays.map((e) => (
            <li key={e.id} className="flex items-stretch gap-3">
              <span className="w-12 shrink-0 pt-0.5 text-xs font-medium text-muted-foreground">
                {e.allDay ? "All day" : format(new Date(e.start), "HH:mm")}
              </span>
              <span className="w-0.5 shrink-0 rounded-full" style={{ backgroundColor: CATEGORY_SPINE[e.category ?? "event"] }} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{e.title}</p>
                {e.location && <p className="truncate text-xs text-muted-foreground">{e.location}</p>}
              </div>
              {e.category && <Chip kind={e.category} className="mt-0.5 self-start" />}
            </li>
          ))}
        </ul>
      )}
    </SpotlightCard>
  );
}

/* ---- Right column ---- */
function WebsiteCard() {
  const { data, loading, error } = useAsync(fetchSystemStatus);
  const p = data?.vercel?.[0];
  return (
    <Link href="/ops/analytics/website" className="block">
      <SpotlightCard className="p-5" onClick={() => {}}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-normal text-foreground" style={{ fontFamily: "var(--font-dm-serif)" }}>
            Website <span className="text-muted-foreground">· 7 days</span>
          </h2>
          {p && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold capitalize" style={{ color: p.state === "ready" ? "#1F9D55" : "#B26B00" }}>
              <Led tone={p.state === "ready" ? "green" : "amber"} /> {p.state}
            </span>
          )}
        </div>
        {loading ? (
          <Skeleton className="h-28 w-full" />
        ) : error || !p ? (
          <p className="py-6 text-sm text-muted-foreground">Analytics unavailable.</p>
        ) : (
          <>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-4xl font-normal leading-none text-foreground" style={{ fontFamily: "var(--font-dm-serif)" }}>
                  <AnimatedNumber value={p.visitors7d} />
                </p>
                <p className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                  visitors <Delta value={p.visitorsDeltaPct} />
                </p>
              </div>
              {p.sparkline?.length > 1 && (
                <div className="h-14 w-32">
                  <Sparkline data={p.sparkline} />
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center gap-5 border-t border-line pt-3 text-sm">
              <span><b className="font-semibold text-foreground">{p.performanceScore || "—"}</b> <span className="text-muted-foreground">Perf</span></span>
              <span><b className="font-semibold text-foreground">{p.lcpSeconds ? `${p.lcpSeconds}s` : "—"}</b> <span className="text-muted-foreground">LCP</span></span>
              {p.topPage && <span className="truncate text-muted-foreground">Top <b className="font-semibold text-foreground">{p.topPage}</b></span>}
            </div>
          </>
        )}
      </SpotlightCard>
    </Link>
  );
}

function TasksCard() {
  const { data, loading } = useSharedTasks();
  const open = data
    .filter((t) => !t.done)
    .sort((a, b) => (a.dueAt ?? Infinity) - (b.dueAt ?? Infinity))
    .slice(0, 4);
  const done = data.filter((t) => t.done).slice(0, 1);
  const rows = [...open, ...(open.length < 3 ? done : [])].slice(0, 4);
  return (
    <SpotlightCard className="p-5">
      <CardHeading title="Today's tasks" href="/ops/tasks" cta="All" />
      {loading ? (
        <Skeleton className="h-20 w-full" />
      ) : rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">Nothing outstanding.</p>
      ) : (
        <ul className="space-y-2.5">
          {rows.map((t) => (
            <li key={t.id} className="flex items-center gap-3">
              <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-md border-2", t.done ? "border-primary bg-primary text-primary-foreground" : "border-line2")}>
                {t.done && <span className="text-[10px]">✓</span>}
              </span>
              <span className={cn("min-w-0 flex-1 truncate text-sm text-foreground", t.done && "text-muted-foreground line-through")}>{t.title}</span>
              {t.priority && <Chip kind={t.priority} />}
            </li>
          ))}
        </ul>
      )}
    </SpotlightCard>
  );
}

function SystemsCard() {
  const { data, loading, error } = useAsync(fetchSystemStatus);
  const repos = data?.repos ?? [];
  const vercel = data?.vercel ?? [];
  const zoho = data?.zoho;
  const healthy = !error && !!data && (zoho?.operational ?? true) && repos.every((r) => r.checksPass) && vercel.every((v) => v.state === "ready");
  return (
    <SpotlightCard className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-normal text-foreground" style={{ fontFamily: "var(--font-dm-serif)" }}>Systems</h2>
        {!loading && <StatusPill tone={error ? "amber" : healthy ? "green" : "amber"}>{error ? "Unknown" : healthy ? "All operational" : "Attention"}</StatusPill>}
      </div>
      {loading ? (
        <Skeleton className="h-16 w-full" />
      ) : (
        <div className="grid grid-cols-3 gap-2.5">
          <StatTile value={<AnimatedNumber value={repos.length} />} label="GitHub repos" />
          <StatTile value={<AnimatedNumber value={vercel.filter((v) => v.state === "ready").length} />} label="Vercel ready" />
          <StatTile value={zoho ? `${zoho.uptimePct}%` : "—"} label="Zoho uptime" />
        </div>
      )}
    </SpotlightCard>
  );
}

export function OverviewClient({ session }: { session: Session }) {
  const now = new Date();
  const dateLine = format(now, "EEEE, d MMMM").toUpperCase();
  const briefing = session.role === "admin" ? "ADMIN BRIEFING" : "STAFF BRIEFING";

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            {dateLine} · {briefing}
          </p>
          <h1 className="mt-1 text-3xl font-normal text-foreground sm:text-4xl" style={{ fontFamily: "var(--font-dm-serif)" }}>
            {greeting()}, {firstName(session.email)}.
          </h1>
        </div>
        <button
          onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_EVENT))}
          className="ops-glass group inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-muted-foreground shadow-card transition-colors hover:text-foreground"
        >
          <Search className="size-4" />
          <span className="hidden sm:inline">Search operations…</span>
          <kbd className="ml-2 hidden rounded bg-chip/70 px-1.5 py-0.5 text-[10px] font-medium sm:inline">⌘K</kbd>
        </button>
      </div>

      {/* Bento */}
      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <Stagger className="space-y-4">
          <Reveal>{session.role === "admin" ? <InboxCard /> : <AnnouncementsCard />}</Reveal>
          <Reveal><TodayTimeline /></Reveal>
        </Stagger>
        <Stagger className="space-y-4">
          <Reveal><WebsiteCard /></Reveal>
          <Reveal><TasksCard /></Reveal>
          <Reveal><SystemsCard /></Reveal>
        </Stagger>
      </div>
    </div>
  );
}
