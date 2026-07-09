"use client";

import { format } from "date-fns";
import { Mail, Inbox, ShieldCheck } from "lucide-react";
import { Stagger, Reveal, AnimatedNumber } from "@/components/staff/ui/motion";
import { Led } from "@/components/staff/ui/primitives";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/components/staff/use-async";
import { fetchSystemStatus } from "@/lib/org/callables";
import { DetailShell, Panel, HeroNumber } from "@/components/staff/analytics/detail-shell";
import { RadialGauge } from "@/components/staff/analytics/viz";

export function ZohoDetail() {
  const { data, loading, error } = useAsync(fetchSystemStatus);
  const z = data?.zoho;
  return (
    <DetailShell
      eyebrow="Zoho"
      title="Mail"
      right={z && <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: z.operational ? "#1F9D55" : "#D8392B" }}><Led tone={z.operational ? "green" : "red"} />{z.operational ? "Operational" : "Down"}</span>}
    >
      {loading ? (
        <Skeleton className="h-48 w-full rounded-[20px]" />
      ) : error || !z ? (
        <Panel><p className="text-sm text-muted-foreground">Mail status unavailable.</p></Panel>
      ) : (
        <Stagger className="space-y-4">
          <Reveal>
            <Panel>
              <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
                <div className="flex justify-center"><RadialGauge value={+z.uptimePct} max={100} unit="%" label="Uptime" tone="#22C55E" /></div>
                <div className="grid grid-cols-3 gap-6">
                  <HeroNumber label="Mailboxes" value={<AnimatedNumber value={z.mailboxes} />} />
                  <HeroNumber label="Incidents" value={<AnimatedNumber value={z.incidents} />} />
                  <HeroNumber label="Address" value={<span className="text-base">{z.address}</span>} />
                </div>
              </div>
            </Panel>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            <Reveal><Panel><div className="flex items-center gap-3"><Mail className="size-5 text-primary" /><div><p className="text-sm font-semibold text-foreground">{z.address}</p><p className="text-xs text-muted-foreground">Primary domain</p></div></div></Panel></Reveal>
            <Reveal><Panel><div className="flex items-center gap-3"><Inbox className="size-5 text-primary" /><div><p className="text-sm font-semibold text-foreground">{z.mailboxes} mailboxes</p><p className="text-xs text-muted-foreground">Active accounts</p></div></div></Panel></Reveal>
            <Reveal><Panel><div className="flex items-center gap-3"><ShieldCheck className="size-5 text-primary" /><div><p className="text-sm font-semibold text-foreground">{z.incidents} incidents</p><p className="text-xs text-muted-foreground">Checked {format(new Date(z.checkedAt), "HH:mm")}</p></div></div></Panel></Reveal>
          </div>
        </Stagger>
      )}
    </DetailShell>
  );
}
