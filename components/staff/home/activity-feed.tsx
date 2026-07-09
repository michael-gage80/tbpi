"use client";

import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Plus, CalendarPlus, Megaphone, Rocket } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SpotlightCard } from "@/components/staff/ui/spotlight-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useSharedTasks,
  useSharedEvents,
  useSharedAnnouncements,
} from "@/components/staff/firestore-hooks";
import { useAsync } from "@/components/staff/use-async";
import { fetchSystemStatus } from "@/lib/org/callables";

type Item = {
  id: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  text: string;
  at: number;
  tone?: string;
};

export function ActivityFeed() {
  const reduce = useReducedMotion();
  const { data: tasks, loading: lt } = useSharedTasks();
  const { data: events } = useSharedEvents();
  const { data: anns } = useSharedAnnouncements();
  const { data: sys } = useAsync(fetchSystemStatus);

  const items: Item[] = [];
  tasks.forEach((t) => {
    if (t.done && t.completedAt) items.push({ id: `tc-${t.id}`, icon: CheckCircle2, text: `Completed “${t.title}”`, at: t.completedAt, tone: "#22C55E" });
    else if (t.createdAt) items.push({ id: `tn-${t.id}`, icon: Plus, text: `Added task “${t.title}”`, at: t.createdAt });
  });
  events.forEach((e) => e.createdAt && items.push({ id: `e-${e.id}`, icon: CalendarPlus, text: `Scheduled “${e.title}”`, at: e.createdAt, tone: "#E8581A" }));
  anns.forEach((a) => a.createdAt && items.push({ id: `a-${a.id}`, icon: Megaphone, text: `Posted “${a.title}”`, at: a.createdAt, tone: "#E8581A" }));
  (sys?.vercel ?? []).forEach((v) => v.lastDeployDate && items.push({ id: `d-${v.id}`, icon: Rocket, text: `${v.name} deployed (${v.state})`, at: new Date(v.lastDeployDate).getTime(), tone: v.state === "ready" ? "#22C55E" : "#E8951A" }));

  const feed = items.sort((a, b) => b.at - a.at).slice(0, 8);

  return (
    <SpotlightCard className="p-5">
      <h2 className="mb-4 text-xl font-normal text-foreground" style={{ fontFamily: "var(--font-dm-serif)" }}>Activity</h2>
      {lt ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
      ) : feed.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No recent activity.</p>
      ) : (
        <ul className="space-y-1">
          <AnimatePresence initial={false}>
            {feed.map((it) => {
              const Icon = it.icon;
              return (
                <motion.li
                  key={it.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 py-1.5"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-chip/70">
                    <Icon className="size-3.5" style={{ color: it.tone ?? "var(--muted-foreground)" }} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">{it.text}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{formatDistanceToNow(it.at, { addSuffix: false })}</span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </SpotlightCard>
  );
}
