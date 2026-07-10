"use client";

import Link from "next/link";
import { Globe, Search, Github, Linkedin, Mail, ArrowUpRight, ShieldAlert } from "lucide-react";
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
import type { VercelProjectStatus, RepoInsights } from "@/lib/firebase/types";

const fmt = (n?: number | null) => (n == null || Number.isNaN(n) ? "—" : n.toLocaleString());
const shortRepo = (full: string) => full.split("/").pop() ?? full;

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
    <Link href={href} className="block h-full">
      <SpotlightCard className="h-full p-5" onClick={() => {}}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="size-4 text-primary" />
            <h3 className="text-xl font-normal text-foreground" style={{ fontFamily: "var(--font-dm-serif)" }}>
              {title}
            </h3>
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

/* ---- Website / Vercel (one card per project) ---- */
function WebsiteCard({ project }: { project: VercelProjectStatus }) {
  return (
    <Shell
      href={`/ops/analytics/website/${encodeURIComponent(project.id)}`}
      icon={Globe}
      title={project.name}
      right={
        <span className="flex items-center gap-1.5 text-xs font-semibold capitalize" style={{ color: project.state === "ready" ? "#1F9D55" : project.state === "error" ? "#D8392B" : "#B26B00" }}>
          <Led tone={project.state === "ready" ? "green" : project.state === "error" ? "red" : "amber"} />{project.state}
        </span>
      }
    >
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <Metric label="Visitors 7d" value={<AnimatedNumber value={project.visitors7d} />} sub={<Delta value={project.visitorsDeltaPct} />} />
          {project.sparkline?.length > 1 && <div className="h-12 w-28"><Sparkline data={project.sparkline} /></div>}
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div><p className="text-[11px] uppercase text-muted-foreground">Perf</p><p className="font-semibold">{project.performanceScore || "—"}</p></div>
          <div><p className="text-[11px] uppercase text-muted-foreground">LCP</p><p className="font-semibold">{project.lcpSeconds ? `${project.lcpSeconds}s` : "—"}</p></div>
          <div><p className="text-[11px] uppercase text-muted-foreground">Top</p><p className="truncate font-semibold">{project.topPage || "—"}</p></div>
        </div>
      </div>
    </Shell>
  );
}

export function WebsiteCards() {
  const { data, loading, error } = useAsync(fetchSystemStatus);
  if (loading) return <><Loading /><Loading /></>;
  if (error || !data?.vercel?.length)
    return <Shell href="/ops/analytics/website" icon={Globe} title="Website"><p className="text-xs text-muted-foreground">Unavailable.</p></Shell>;
  return <>{data.vercel.map((p) => <WebsiteCard key={p.id} project={p} />)}</>;
}

/* ---- GitHub (one card per repo, red shield on critical) ---- */
function GithubRepoCard({ repo }: { repo: RepoInsights }) {
  const crit = repo.dependabot?.critical ?? 0;
  const high = repo.dependabot?.high ?? 0;
  const ciOk = repo.ciSuccessRatePct != null && repo.ciSuccessRatePct >= 80;
  return (
    <Shell
      href={`/ops/analytics/github/${encodeURIComponent(shortRepo(repo.fullName))}`}
      icon={Github}
      title={shortRepo(repo.fullName)}
      right={
        crit > 0 ? (
          <span className="flex items-center gap-1 text-xs font-bold text-[#D8392B]"><ShieldAlert className="size-4 ops-anim" style={{ animation: "tbpiLed 1.6s ease-in-out infinite" }} />{crit}</span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: ciOk ? "#1F9D55" : "#B26B00" }}><Led tone={ciOk ? "green" : "amber"} />CI</span>
        )
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <Metric label="Awaiting review" value={repo.awaitingReviewCount ?? 0} />
        <Metric label="Open issues" value={repo.issuesOpen ?? 0} />
        <Metric label="Vulns (crit/high)" value={<span style={{ color: crit ? "#D8392B" : undefined }}>{crit}/{high}</span>} />
        <Metric label="CI success" value={repo.ciSuccessRatePct != null ? `${repo.ciSuccessRatePct}%` : "—"} />
      </div>
    </Shell>
  );
}

export function GithubCards() {
  const { data, loading, error } = useAsync(fetchGithubInsights);
  if (loading) return <><Loading /><Loading /></>;
  if (error || !data?.repos?.length)
    return <Shell href="/ops/analytics/github/tbpi" icon={Github} title="GitHub"><p className="text-xs text-muted-foreground">Unavailable.</p></Shell>;
  return <>{data.repos.map((r) => <GithubRepoCard key={r.fullName} repo={r} />)}</>;
}

export function SearchCard() {
  const { data, loading, error } = useAsync(fetchSearchConsoleSnapshot);
  return (
    <Shell href="/ops/analytics/search" icon={Search} title="Search">
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
