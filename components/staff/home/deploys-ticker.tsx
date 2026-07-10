"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Rocket } from "lucide-react";
import { Led } from "@/components/staff/ui/primitives";
import { useAsync } from "@/components/staff/use-async";
import { fetchSystemStatus } from "@/lib/org/callables";

export function DeploysTicker() {
  const { data } = useAsync(fetchSystemStatus);
  const projects = data?.vercel ?? [];
  if (projects.length === 0) return null;

  return (
    <div className="flex items-center gap-4 overflow-x-auto rounded-full ops-glass px-4 py-2.5 shadow-card">
      <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
        <Rocket className="size-3.5" /> Deploys
      </span>
      <div className="flex min-w-0 items-center gap-5">
        {projects.map((p) => (
          <Link key={p.id} href={`/ops/analytics/website/${encodeURIComponent(p.id)}`} className="flex shrink-0 items-center gap-2 text-xs">
            <Led tone={p.state === "ready" ? "green" : p.state === "error" ? "red" : "amber"} />
            <span className="font-medium text-foreground">{p.name}</span>
            <span className="capitalize text-muted-foreground">{p.state}</span>
            <span className="text-muted-foreground">· {formatDistanceToNow(new Date(p.lastDeployDate), { addSuffix: true })}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
