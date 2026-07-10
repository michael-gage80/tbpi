"use client";

import { format } from "date-fns";
import { Stagger, Reveal, AnimatedNumber } from "@/components/staff/ui/motion";
import { Delta } from "@/components/staff/ui/primitives";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/components/staff/use-async";
import { fetchSearchConsoleSnapshot } from "@/lib/org/callables";
import { DetailShell, Panel, HeroNumber, AreaTrend } from "@/components/staff/analytics/detail-shell";
import { RankList } from "@/components/staff/analytics/viz";

export function SearchDetail() {
  const { data, loading, error } = useAsync(fetchSearchConsoleSnapshot);
  const series = (data?.series ?? []).map((p) => ({
    date: format(new Date(p.date), "d MMM"),
    clicks: p.clicks,
  }));
  const toRows = (rows?: { label: string; clicks: number }[]) =>
    (rows ?? []).map((r) => ({ label: r.label, value: r.clicks }));

  return (
    <DetailShell eyebrow="Google Search Console" title="Search">
      {loading ? (
        <Skeleton className="h-48 w-full rounded-[20px]" />
      ) : error ? (
        <Panel><p className="text-sm text-muted-foreground">Search data unavailable.</p></Panel>
      ) : (
        <Stagger className="space-y-4">
          <Reveal>
            <Panel>
              <div className="mb-4 flex flex-wrap items-end gap-8">
                <HeroNumber label="Clicks" value={<AnimatedNumber value={data?.clicks ?? 0} />} delta={<Delta value={data?.clicksDeltaPct} />} />
                <HeroNumber label="Impressions" value={<AnimatedNumber value={data?.impressions ?? 0} />} delta={<Delta value={data?.impressionsDeltaPct} />} />
                <HeroNumber label="Avg CTR" value={data?.avgCtr != null ? `${(data.avgCtr * 100).toFixed(1)}%` : "—"} />
                <HeroNumber label="Avg position" value={data?.avgPosition != null ? data.avgPosition.toFixed(1) : "—"} />
              </div>
              {series.length > 1 && <AreaTrend data={series} xKey="date" yKey="clicks" />}
            </Panel>
          </Reveal>
          <div className="grid gap-4 lg:grid-cols-2">
            <Reveal><Panel title="Top queries"><RankList rows={toRows(data?.topQueries)} /></Panel></Reveal>
            <Reveal><Panel title="Top pages"><RankList rows={toRows(data?.topPages)} /></Panel></Reveal>
            <Reveal><Panel title="Countries"><RankList rows={toRows(data?.countries)} /></Panel></Reveal>
            <Reveal><Panel title="Devices"><RankList rows={toRows(data?.devices)} /></Panel></Reveal>
          </div>
        </Stagger>
      )}
    </DetailShell>
  );
}
