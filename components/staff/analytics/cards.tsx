"use client";

import Link from "next/link";
import { Globe, Search, Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { SpotlightCard } from "@/components/staff/ui/spotlight-card";
import { Sparkline } from "@/components/staff/ui/sparkline";
import { AnimatedNumber } from "@/components/staff/ui/motion";
import { Led, Delta } from "@/components/staff/ui/primitives";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/components/staff/use-async";
import {
  fetchSystemStatus,
  fetchSearchConsoleSnapshot,
  fetchGithubInsights,
  fetchLinkedInSnapshot,
} from "@/lib/org/callables";

const fmt = (n?: number | null) => (n == null || Number.isNaN(n) ? "—" : n.toLocaleString());

function Shell({
  href,
  icon: Icon,
  title,
  right,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="block">
      <SpotlightCard className="h-full p-5" onClick={() => {}}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            {right}
            <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
        {children}
      </SpotlightCard>
    </Link>
  );
}

function Metric({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-xl font-normal text-foreground" style={{ fontFamily: "var(--font-dm-serif)" }}>
        {value}
      </p>
      {sub && <div className="mt-0.5">{sub}</div>}
    </div>
  );
}

const Loading = () => <Skeleton className="h-20 w-full" />;

export function WebsiteCard() {
  const { data, loading, error } = useAsync(fetchSystemStatus);
  const p = data?.vercel?.[0];
  return (
    <Shell
      href="/ops/analytics/website"
      icon={Globe}
      title="Website"
      right={p && <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: p.state === "ready" ? "#1F9D55" : "#B26B00" }}><Led tone={p.state === "ready" ? "green" : "amber"} />{p.state}</span>}
    >
      {loading ? <Loading /> : error || !p ? <p className="text-xs text-muted-foreground">Unavailable.</p> : (
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <Metric label="Visitors 7d" value={<AnimatedNumber value={p.visitors7d} />} sub={<Delta value={p.visitorsDeltaPct} />} />
            {p.sparkline?.length > 1 && <div className="h-12 w-28"><Sparkline data={p.sparkline} /></div>}
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div><p className="text-[11px] uppercase text-muted-foreground">Perf</p><p className="font-semibold">{p.performanceScore || "—"}</p></div>
            <div><p className="text-[11px] uppercase text-muted-foreground">LCP</p><p className="font-semibold">{p.lcpSeconds ? `${p.lcpSeconds}s` : "—"}</p></div>
            <div><p className="text-[11px] uppercase text-muted-foreground">Top</p><p className="truncate font-semibold">{p.topPage || "—"}</p></div>
          </div>
        </div>
      )}
    </Shell>
  );
}

export function SearchCard() {
  const { data, loading, error } = useAsync(fetchSearchConsoleSnapshot);
  return (
    <Shell href="/ops/analytics/search" icon={Search} title="Search (Google)">
      {loading ? <Loading /> : error ? <p className="text-xs text-muted-foreground">Unavailable.</p> : (
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <Metric label="Clicks 7d" value={fmt(data?.clicks)} sub={<Delta value={data?.clicksDeltaPct} />} />
            <Metric label="Impressions" value={fmt(data?.impressions)} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-[11px] uppercase text-muted-foreground">Avg CTR</p><p className="font-semibold">{data?.avgCtr != null ? `${(data.avgCtr * 100).toFixed(1)}%` : "—"}</p></div>
            <div><p className="text-[11px] uppercase text-muted-foreground">Avg position</p><p className="font-semibold">{data?.avgPosition != null ? data.avgPosition.toFixed(1) : "—"}</p></div>
          </div>
        </div>
      )}
    </Shell>
  );
}

export function GithubCard() {
  const { data, loading, error } = useAsync(fetchGithubInsights);
  const repos = data?.repos ?? [];
  const awaiting = repos.reduce((a, r) => a + (r.awaitingReviewCount ?? 0), 0);
  const crit = repos.reduce((a, r) => a + (r.dependabot?.critical ?? 0) + (r.dependabot?.high ?? 0), 0);
  const firstRepo = repos[0]?.fullName?.split("/").pop() ?? "tbpi";
  return (
    <Shell href={`/ops/analytics/github/${encodeURIComponent(firstRepo)}`} icon={Github} title="GitHub">
      {loading ? <Loading /> : error ? <p className="text-xs text-muted-foreground">Unavailable.</p> : (
        <div className="grid grid-cols-2 gap-4">
          <Metric label="Repos" value={repos.length} />
          <Metric label="Awaiting review" value={awaiting} />
          <Metric label="Vulns (crit/high)" value={<span style={{ color: crit ? "#D8392B" : undefined }}>{crit}</span>} />
          <Metric label="Open issues" value={repos.reduce((a, r) => a + (r.issuesOpen ?? 0), 0)} />
        </div>
      )}
    </Shell>
  );
}

export function LinkedInCard() {
  const { data, loading, error } = useAsync(fetchLinkedInSnapshot);
  const a = data?.analytics;
  const none = data && data.source === "none";
  return (
    <Shell href="/ops/analytics/linkedin" icon={Linkedin} title="LinkedIn">
      {loading ? <Loading /> : error ? <p className="text-xs text-muted-foreground">Unavailable.</p> : none || !a ? (
        <p className="text-xs text-muted-foreground">Not connected yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Metric label="Followers" value={fmt(a.followers)} />
          <Metric label="Impressions 30d" value={fmt(a.impressions30d)} />
          <Metric label="Engagement" value={a.engagementRate != null ? `${(a.engagementRate * 100).toFixed(1)}%` : "—"} />
          <Metric label="Views 30d" value={fmt(a.pageViews30d)} />
        </div>
      )}
    </Shell>
  );
}

export function ZohoCard() {
  const { data, loading, error } = useAsync(fetchSystemStatus);
  const z = data?.zoho;
  return (
    <Shell
      href="/ops/analytics/zoho"
      icon={Mail}
      title="Zoho Mail"
      right={z && <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: z.operational ? "#1F9D55" : "#D8392B" }}><Led tone={z.operational ? "green" : "red"} />{z.operational ? "Operational" : "Down"}</span>}
    >
      {loading ? <Loading /> : error || !z ? <p className="text-xs text-muted-foreground">Unavailable.</p> : (
        <div className="grid grid-cols-3 gap-4">
          <Metric label="Mailboxes" value={z.mailboxes} />
          <Metric label="Uptime" value={`${z.uptimePct}%`} />
          <Metric label="Incidents" value={z.incidents} />
        </div>
      )}
    </Shell>
  );
}
