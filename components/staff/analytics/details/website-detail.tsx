"use client";

import { format } from "date-fns";
import { Stagger, Reveal, AnimatedNumber } from "@/components/staff/ui/motion";
import { Led, Delta } from "@/components/staff/ui/primitives";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/components/staff/use-async";
import {
  fetchSystemStatus,
  fetchWebsiteAnalytics,
  fetchDeployHistory,
} from "@/lib/org/callables";
import { DetailShell, Panel, HeroNumber, AreaTrend } from "@/components/staff/analytics/detail-shell";
import { RadialGauge, RankList } from "@/components/staff/analytics/viz";

const deployTone = (s: string): "green" | "red" | "amber" =>
  s === "ready" ? "green" : s === "error" ? "red" : "amber";

export function WebsiteDetail({ projectId }: { projectId?: string }) {
  const { data, loading, error } = useAsync(async () => {
    const sys = await fetchSystemStatus();
    const project = projectId ? sys.vercel?.find((v) => v.id === projectId) ?? null : sys.vercel?.[0] ?? null;
    if (!project) return { sys, project: null, analytics: null, deploys: null };
    const [analytics, deploys] = await Promise.all([
      fetchWebsiteAnalytics(project.id, 30).catch(() => null),
      fetchDeployHistory(project.id).catch(() => null),
    ]);
    return { sys, project, analytics, deploys };
  }, [projectId]);

  const p = data?.project;
  const a = data?.analytics;
  const series = (a?.series ?? []).map((pt) => ({
    date: format(new Date(pt.date), "d MMM"),
    visitors: pt.visitors,
  }));

  return (
    <DetailShell
      eyebrow="Vercel"
      title={p?.name ?? "Website"}
      right={
        p && (
          <span className="flex items-center gap-1.5 text-sm font-semibold capitalize" style={{ color: p.state === "ready" ? "#1F9D55" : "#B26B00" }}>
            <Led tone={p.state === "ready" ? "green" : "amber"} /> {p.state}
          </span>
        )
      }
    >
      {loading ? (
        <div className="grid gap-4 lg:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-48 w-full rounded-[20px]" />)}</div>
      ) : error || !p ? (
        <Panel><p className="text-sm text-muted-foreground">Analytics unavailable.</p></Panel>
      ) : (
        <Stagger className="space-y-4">
          {/* Hero + trend */}
          <Reveal>
            <Panel className="overflow-hidden">
              <div className="mb-4 flex flex-wrap items-end gap-8">
                <HeroNumber label={`Visitors · ${a?.days ?? 30}d`} value={<AnimatedNumber value={a?.visitors ?? p.visitors7d} />} delta={<Delta value={a?.visitorsDeltaPct ?? p.visitorsDeltaPct} />} />
                <HeroNumber label="Pageviews" value={<AnimatedNumber value={a?.pageviews ?? 0} />} delta={<Delta value={a?.pageviewsDeltaPct} />} />
                <div className="ml-auto text-right text-xs text-muted-foreground">
                  <p>{p.domain}</p>
                  <p>Last deploy {format(new Date(p.lastDeployDate), "d MMM, HH:mm")}</p>
                </div>
              </div>
              {series.length > 1 && <AreaTrend data={series} xKey="date" yKey="visitors" />}
            </Panel>
          </Reveal>

          {/* Vitals gauges */}
          <Reveal>
            <Panel title="Performance & Web Vitals">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                <RadialGauge value={p.performanceScore || null} max={100} label="Perf score" />
                <RadialGauge value={p.vitals?.lcpMs ? +(p.vitals.lcpMs / 1000).toFixed(1) : p.lcpSeconds || null} max={4} unit="s" label="LCP" tone="#3B82F6" />
                <RadialGauge value={p.vitals?.cls != null ? +p.vitals.cls.toFixed(2) : null} max={0.25} label="CLS" tone="#8E8E93" />
                <RadialGauge value={p.vitals?.inpMs ?? null} max={500} unit="ms" label="INP" tone="#22C55E" />
              </div>
              {p.vitals?.rating && <p className="mt-4 text-center text-xs text-muted-foreground">Rating: <span className="font-semibold capitalize text-foreground">{p.vitals.rating}</span> · source {p.vitals.source}</p>}
            </Panel>
          </Reveal>

          {/* Breakdowns */}
          <div className="grid gap-4 lg:grid-cols-2">
            {a && (
              <>
                <Reveal><Panel title="Top pages"><RankList rows={a.topPages.slice(0, 8)} /></Panel></Reveal>
                <Reveal><Panel title="Referrers"><RankList rows={a.referrers.slice(0, 8)} /></Panel></Reveal>
                <Reveal><Panel title="Countries"><RankList rows={a.countries.slice(0, 8)} /></Panel></Reveal>
                <Reveal><Panel title="Devices & browsers"><RankList rows={[...a.devices, ...a.browsers].slice(0, 8)} /></Panel></Reveal>
              </>
            )}
          </div>

          {/* Deploy history */}
          <Reveal>
            <Panel title="Recent deployments">
              {!data?.deploys?.deployments?.length ? (
                <p className="text-sm text-muted-foreground">No deploy history.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {data.deploys.deployments.slice(0, 10).map((d) => (
                    <li key={d.id} className="flex items-center gap-3 py-3">
                      <Led tone={deployTone(d.state)} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium capitalize text-foreground">{d.state} · {d.target}</p>
                        <p className="truncate text-xs text-muted-foreground">{d.creator || "system"} · {format(new Date(d.createdAt), "d MMM, HH:mm")}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{d.buildSeconds}s</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </Reveal>
        </Stagger>
      )}
    </DetailShell>
  );
}
