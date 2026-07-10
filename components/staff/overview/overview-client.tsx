"use client";

import { format } from "date-fns";
import { Pin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Led, Chip } from "@/components/staff/ui/primitives";
import { SectionLabel } from "@/components/staff/ui/page-heading";
import { WebsiteCard, SearchCard, GithubCard, LinkedInCard } from "@/components/staff/analytics/cards";
import { useAsync } from "@/components/staff/use-async";
import { fetchSystemStatus } from "@/lib/org/callables";
import {
  useSharedTasks,
  useSharedEvents,
  useSharedAnnouncements,
} from "@/components/staff/firestore-hooks";
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

function SystemsHealth() {
  const { data, loading, error } = useAsync(fetchSystemStatus);

  if (loading) return <Skeleton className="h-14 w-full rounded-xl" />;

  const healthy =
    !error &&
    !!data &&
    (data.zoho?.operational ?? true) &&
    (data.repos ?? []).every((r) => r.checksPass) &&
    (data.vercel ?? []).every((v) => v.state === "ready");

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <Led tone={error ? "amber" : healthy ? "green" : "amber"} />
      <p className="text-sm font-medium text-foreground">
        {error
          ? "Status unavailable"
          : healthy
            ? "All systems operational"
            : "Some systems need attention"}
      </p>
    </div>
  );
}

function DueTasks() {
  const { data, loading } = useSharedTasks();
  const open = data
    .filter((t) => !t.done)
    .sort((a, b) => (a.dueAt ?? Infinity) - (b.dueAt ?? Infinity))
    .slice(0, 5);

  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <SectionLabel>Due tasks</SectionLabel>
        {loading ? (
          <Skeleton className="h-20 w-full" />
        ) : open.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing outstanding.</p>
        ) : (
          <ul className="space-y-2.5">
            {open.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-2">
                <span className="truncate text-sm text-foreground">{t.title}</span>
                <span className="flex shrink-0 items-center gap-2">
                  {t.priority && <Chip kind={t.priority} />}
                  {t.dueAt && (
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(t.dueAt), "d MMM")}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function TodayEvents() {
  const { data, loading } = useSharedEvents();
  const today = new Date();
  const todays = data.filter((e) => {
    const d = new Date(e.start);
    return d.toDateString() === today.toDateString();
  });

  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <SectionLabel>Today</SectionLabel>
        {loading ? (
          <Skeleton className="h-20 w-full" />
        ) : todays.length === 0 ? (
          <p className="text-sm text-muted-foreground">No events today.</p>
        ) : (
          <ul className="space-y-2.5">
            {todays.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-2">
                <span className="truncate text-sm text-foreground">{e.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {e.allDay ? "All day" : format(new Date(e.start), "HH:mm")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function PinnedAnnouncements() {
  const { data, loading } = useSharedAnnouncements();
  const pinned = data.filter((a) => a.pinned).slice(0, 3);
  if (loading || pinned.length === 0) return null;
  return (
    <div className="space-y-3">
      <SectionLabel>Pinned</SectionLabel>
      {pinned.map((a) => (
        <div key={a.id} className="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Pin className="size-3.5 text-primary" /> {a.title}
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-foreground/80">{a.body}</p>
        </div>
      ))}
    </div>
  );
}

export function OverviewClient({ session }: { session: Session }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-normal text-foreground" style={{ fontFamily: "var(--font-dm-serif)" }}>
          {greeting()}, {firstName(session.email)}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Here’s where things stand today.</p>
      </div>

      <SystemsHealth />
      <PinnedAnnouncements />

      <div className="grid gap-5 md:grid-cols-2">
        <WebsiteCard />
        <SearchCard />
        <GithubCard />
        <LinkedInCard />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <DueTasks />
        <TodayEvents />
      </div>
    </div>
  );
}
