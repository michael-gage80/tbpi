"use client";

import { useEffect, useState } from "react";
import { useSharedTasks, useSharedEvents } from "@/components/staff/firestore-hooks";
import { useAsync } from "@/components/staff/use-async";
import { fetchSystemStatus } from "@/lib/org/callables";
import { useSecurity } from "@/components/staff/security";
import { mail } from "@/components/staff/email/mail-api";
import type { Role } from "@/lib/firebase/types";

function Seg({ tone = "muted", children }: { tone?: "green" | "amber" | "red" | "muted"; children: React.ReactNode }) {
  const color = tone === "green" ? "#22C55E" : tone === "amber" ? "#E8951A" : tone === "red" ? "#D8392B" : "var(--muted-foreground)";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-1.5 rounded-full ops-anim" style={{ backgroundColor: color, animation: tone !== "muted" ? "tbpiLed 2.4s ease-in-out infinite" : undefined }} />
      <span className="text-muted-foreground">{children}</span>
    </span>
  );
}

export function PulseSummary({ role }: { role: Role }) {
  const { data: tasks } = useSharedTasks();
  const { data: events } = useSharedEvents();
  const { data: sys } = useAsync(fetchSystemStatus);
  const { summary: security } = useSecurity();
  const [unread, setUnread] = useState<number | null>(null);

  useEffect(() => {
    if (role !== "admin") return;
    mail.folders().then((f) => setUnread(f.find((x) => x.systemKind === "inbox" || x.id === "inbox")?.unreadCount ?? 0)).catch(() => {});
  }, [role]);

  const today = new Date().toDateString();
  const todayEvents = events.filter((e) => new Date(e.start).toDateString() === today).length;
  const openTasks = tasks.filter((t) => !t.done).length;
  const healthy = !!sys && (sys.zoho?.operational ?? true) && (sys.repos ?? []).every((r) => r.checksPass) && (sys.vercel ?? []).every((v) => v.state === "ready");

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
      <Seg>{todayEvents} {todayEvents === 1 ? "event" : "events"} · {openTasks} open {openTasks === 1 ? "task" : "tasks"}</Seg>
      {role === "admin" && unread != null && unread > 0 && <Seg tone="amber">{unread} need reply</Seg>}
      <Seg tone={healthy ? "green" : "amber"}>{healthy ? "all systems operational" : "systems need attention"}</Seg>
      <Seg tone={security.critical > 0 ? "red" : "green"}>
        {security.critical > 0 ? `${security.critical} critical vuln${security.critical > 1 ? "s" : ""}` : "no critical vulns"}
      </Seg>
    </div>
  );
}
