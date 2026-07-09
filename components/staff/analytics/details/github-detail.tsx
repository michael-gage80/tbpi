"use client";

import { format } from "date-fns";
import { Star, GitFork, CircleDot, GitPullRequest, ShieldAlert } from "lucide-react";
import { Stagger, Reveal, AnimatedNumber } from "@/components/staff/ui/motion";
import { Led } from "@/components/staff/ui/primitives";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/components/staff/use-async";
import {
  fetchGithubInsights,
  fetchCodebaseAnalytics,
  fetchDependabotAlerts,
} from "@/lib/org/callables";
import { DetailShell, Panel, HeroNumber, BarTrend } from "@/components/staff/analytics/detail-shell";
import { Donut } from "@/components/staff/analytics/viz";

const SEV: Record<string, string> = { critical: "#D8392B", high: "#E8581A", medium: "#E8951A", low: "#8E8E93" };

export function GithubDetail({ repo }: { repo: string }) {
  const { data, loading, error } = useAsync(async () => {
    const gi = await fetchGithubInsights();
    const insight = gi.repos.find((r) => r.fullName.endsWith(`/${repo}`)) ?? gi.repos[0];
    if (!insight) return { insight: null, codebase: null, alerts: null };
    const [codebase, alerts] = await Promise.all([
      fetchCodebaseAnalytics(insight.fullName).catch(() => null),
      fetchDependabotAlerts(insight.fullName).catch(() => null),
    ]);
    return { insight, codebase, alerts };
  }, [repo]);

  const c = data?.codebase;
  const weekly = (c?.weeklyCommits ?? []).slice(-26).map((w) => ({
    week: format(new Date(w.weekStart), "d MMM"),
    commits: w.commits,
  }));
  const langs = (c?.languages ?? []).slice(0, 6).map((l, i) => ({
    label: l.name,
    value: l.bytes,
    color: ["#E8581A", "#3B82F6", "#22C55E", "#8E8E93", "#E8951A", "#D8392B"][i % 6],
  }));
  const alerts = data?.alerts?.alerts ?? [];
  const sevCounts = ["critical", "high", "medium", "low"].map((s) => ({
    label: s[0].toUpperCase() + s.slice(1),
    value: alerts.filter((a) => a.severity === s).length,
    color: SEV[s],
  })).filter((x) => x.value > 0);

  return (
    <DetailShell
      eyebrow="GitHub"
      title={c?.fullName?.split("/").pop() ?? repo}
      right={c && <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: c.checksPass ? "#1F9D55" : "#D8392B" }}><Led tone={c.checksPass ? "green" : "red"} />{c.checksPass ? "CI pass" : "CI failing"}</span>}
    >
      {loading ? (
        <Skeleton className="h-48 w-full rounded-[20px]" />
      ) : error || !c ? (
        <Panel><p className="text-sm text-muted-foreground">Repo analytics unavailable.</p></Panel>
      ) : (
        <Stagger className="space-y-4">
          <Reveal>
            <Panel>
              {c.description && <p className="mb-4 text-sm text-muted-foreground">{c.description}</p>}
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-5">
                <HeroNumber label="Stars" value={<AnimatedNumber value={c.stars} />} />
                <HeroNumber label="Forks" value={<AnimatedNumber value={c.forks} />} />
                <HeroNumber label="Open issues" value={<AnimatedNumber value={c.openIssues} />} />
                <HeroNumber label="Open PRs" value={<AnimatedNumber value={c.openPRs} />} />
                <HeroNumber label="Merged PRs" value={<AnimatedNumber value={c.closedPRs} />} />
              </div>
            </Panel>
          </Reveal>

          <div className="grid gap-4 lg:grid-cols-2">
            <Reveal><Panel title="Commits (26 weeks)">{weekly.length ? <BarTrend data={weekly} xKey="week" yKey="commits" /> : <p className="text-sm text-muted-foreground">No commit data.</p>}</Panel></Reveal>
            <Reveal><Panel title="Languages">{langs.length ? <Donut segments={langs} /> : <p className="text-sm text-muted-foreground">No language data.</p>}</Panel></Reveal>
          </div>

          <Reveal>
            <Panel title={`Dependabot alerts${alerts.length ? ` · ${alerts.length}` : ""}`} action={<ShieldAlert className="size-4 text-muted-foreground" />}>
              {alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No open alerts. 🎉</p>
              ) : (
                <div className="grid gap-5 lg:grid-cols-[auto_1fr]">
                  {sevCounts.length > 0 && <Donut segments={sevCounts} size={120} />}
                  <ul className="divide-y divide-line">
                    {alerts.slice(0, 12).map((al) => (
                      <li key={al.id} className="flex items-start gap-3 py-2.5">
                        <span className="mt-1 size-2 shrink-0 rounded-full" style={{ backgroundColor: SEV[al.severity] ?? "#8E8E93" }} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{al.packageName} <span className="text-muted-foreground">({al.ecosystem})</span></p>
                          <p className="truncate text-xs text-muted-foreground">{al.summary}</p>
                        </div>
                        <span className="shrink-0 text-xs font-semibold capitalize" style={{ color: SEV[al.severity] }}>{al.severity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Panel>
          </Reveal>

          <div className="grid gap-4 lg:grid-cols-2">
            <Reveal><Panel title="Top contributors">
              <ul className="space-y-2">
                {(c.contributors ?? []).slice(0, 8).map((ct) => (
                  <li key={ct.login} className="flex items-center justify-between gap-2 text-sm">
                    <span className="flex items-center gap-2"><CircleDot className="size-3.5 text-muted-foreground" />{ct.login}</span>
                    <span className="font-semibold text-foreground">{ct.commits}</span>
                  </li>
                ))}
              </ul>
            </Panel></Reveal>
            <Reveal><Panel title="Recent commits">
              <ul className="space-y-2.5">
                {(c.recentCommits ?? []).slice(0, 6).map((cm) => (
                  <li key={cm.sha} className="text-sm">
                    <p className="truncate text-foreground">{cm.message}</p>
                    <p className="text-xs text-muted-foreground">{cm.author} · {format(new Date(cm.date), "d MMM")}</p>
                  </li>
                ))}
              </ul>
            </Panel></Reveal>
          </div>

          <Reveal>
            <Panel title="Repository">
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Star className="size-4" /> {c.stars}</span>
                <span className="flex items-center gap-1.5"><GitFork className="size-4" /> {c.forks}</span>
                <span className="flex items-center gap-1.5"><GitPullRequest className="size-4" /> {c.openPRs} open</span>
                <span>{(c.sizeKB / 1024).toFixed(1)} MB</span>
                <span>default: {c.defaultBranch}</span>
                {c.pushedAt && <span>pushed {format(new Date(c.pushedAt), "d MMM")}</span>}
              </div>
            </Panel>
          </Reveal>
        </Stagger>
      )}
    </DetailShell>
  );
}
