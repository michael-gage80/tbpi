"use client";

import { Globe, Search, Github, Linkedin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkline, Delta, Led } from "@/components/staff/ui/primitives";
import { useAsync } from "@/components/staff/use-async";
import {
  fetchSystemStatus,
  fetchSearchConsoleSnapshot,
  fetchGithubInsights,
  fetchLinkedInSnapshot,
} from "@/lib/org/callables";
import type { GitHubInsights } from "@/lib/firebase/types";

function fmt(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString();
}

function CardShell({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Icon className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        {children}
      </CardContent>
    </Card>
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

function LoadingRows() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

function ErrorNote({ error }: { error: string }) {
  return <p className="text-xs text-muted-foreground">Unavailable — {error}</p>;
}

export function WebsiteCard() {
  const { data, loading, error } = useAsync(fetchSystemStatus);
  const project = data?.vercel?.[0];
  return (
    <CardShell icon={Globe} title="Website">
      {loading ? (
        <LoadingRows />
      ) : error ? (
        <ErrorNote error={error} />
      ) : !project ? (
        <p className="text-xs text-muted-foreground">No project data.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <Metric
              label="Visitors 7d"
              value={fmt(project.visitors7d)}
              sub={<Delta value={project.visitorsDeltaPct} />}
            />
            {project.sparkline?.length > 1 && <Sparkline data={project.sparkline} />}
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-[11px] uppercase text-muted-foreground">Perf</p>
              <p className="font-semibold">{project.performanceScore || "—"}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase text-muted-foreground">LCP</p>
              <p className="font-semibold">{project.lcpSeconds ? `${project.lcpSeconds}s` : "—"}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase text-muted-foreground">Deploy</p>
              <p className="flex items-center gap-1.5 font-semibold capitalize">
                <Led tone={project.state === "ready" ? "green" : project.state === "error" ? "red" : "amber"} />
                {project.state}
              </p>
            </div>
          </div>
        </div>
      )}
    </CardShell>
  );
}

export function SearchCard() {
  const { data, loading, error } = useAsync(fetchSearchConsoleSnapshot);
  return (
    <CardShell icon={Search} title="Search (Google)">
      {loading ? (
        <LoadingRows />
      ) : error ? (
        <ErrorNote error={error} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <Metric label="Clicks 7d" value={fmt(data?.clicks)} sub={<Delta value={data?.clicksDeltaPct} />} />
            <Metric label="Impressions" value={fmt(data?.impressions)} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[11px] uppercase text-muted-foreground">Avg CTR</p>
              <p className="font-semibold">{data?.avgCtr != null ? `${(data.avgCtr * 100).toFixed(1)}%` : "—"}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase text-muted-foreground">Avg position</p>
              <p className="font-semibold">{data?.avgPosition != null ? data.avgPosition.toFixed(1) : "—"}</p>
            </div>
          </div>
          {!!data?.topQueries?.length && (
            <div>
              <p className="mb-1.5 text-[11px] uppercase text-muted-foreground">Top queries</p>
              <ul className="space-y-1">
                {data.topQueries.slice(0, 3).map((q) => (
                  <li key={q.label} className="flex justify-between gap-2 text-xs">
                    <span className="truncate text-foreground">{q.label}</span>
                    <span className="shrink-0 text-muted-foreground">{q.clicks}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </CardShell>
  );
}

function aggregateGithub(data: GitHubInsights | null) {
  const repos = data?.repos ?? [];
  return repos.reduce(
    (acc, r) => {
      acc.awaiting += r.awaitingReviewCount ?? 0;
      acc.stuck += r.stuckPRs?.length ?? 0;
      acc.critical += r.dependabot?.critical ?? 0;
      acc.high += r.dependabot?.high ?? 0;
      if (r.ciSuccessRatePct != null) {
        acc.ciSum += r.ciSuccessRatePct;
        acc.ciCount += 1;
      }
      return acc;
    },
    { awaiting: 0, stuck: 0, critical: 0, high: 0, ciSum: 0, ciCount: 0 }
  );
}

export function GithubCard() {
  const { data, loading, error } = useAsync(fetchGithubInsights);
  const g = aggregateGithub(data);
  const ci = g.ciCount ? Math.round(g.ciSum / g.ciCount) : null;
  return (
    <CardShell icon={Github} title="GitHub">
      {loading ? (
        <LoadingRows />
      ) : error ? (
        <ErrorNote error={error} />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Metric label="Awaiting review" value={fmt(g.awaiting)} />
          <Metric label="Stuck PRs" value={fmt(g.stuck)} />
          <Metric
            label="Vulns (crit/high)"
            value={
              <span style={{ color: g.critical + g.high > 0 ? "#D8392B" : undefined }}>
                {g.critical}/{g.high}
              </span>
            }
          />
          <Metric label="CI success" value={ci != null ? `${ci}%` : "—"} />
        </div>
      )}
    </CardShell>
  );
}

export function LinkedInCard() {
  const { data, loading, error } = useAsync(fetchLinkedInSnapshot);
  const a = data?.analytics;
  const noData = data && data.source === "none";
  return (
    <CardShell icon={Linkedin} title="LinkedIn">
      {loading ? (
        <LoadingRows />
      ) : error ? (
        <ErrorNote error={error} />
      ) : noData || !a ? (
        <p className="text-xs text-muted-foreground">
          Analytics not connected yet (Community Management API pending).
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Metric label="Followers" value={fmt(a.followers)} sub={<Delta value={a.followerGain30d ? (a.followerGain30d / (a.followers || 1)) * 100 : null} />} />
          <Metric label="Impressions 30d" value={fmt(a.impressions30d)} />
          <Metric
            label="Engagement"
            value={a.engagementRate != null ? `${(a.engagementRate * 100).toFixed(1)}%` : "—"}
          />
          <Metric label="Page views 30d" value={fmt(a.pageViews30d)} />
        </div>
      )}
    </CardShell>
  );
}
