"use client";

import { format } from "date-fns";
import { ExternalLink, ShieldCheck, ShieldAlert } from "lucide-react";
import { Stagger, Reveal, AnimatedNumber } from "@/components/staff/ui/motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/components/staff/use-async";
import { fetchGithubInsights, fetchDependabotAlerts } from "@/lib/org/callables";
import { summarize } from "@/components/staff/security";
import { DetailShell, Panel, HeroNumber } from "@/components/staff/analytics/detail-shell";
import { RadialGauge, Donut } from "@/components/staff/analytics/viz";
import type { DependabotAlertDetail } from "@/lib/firebase/types";

const SEV: Record<string, string> = { critical: "#D8392B", high: "#E8581A", medium: "#E8951A", low: "#8E8E93" };
const order = ["critical", "high", "medium", "low"];

export function SecurityDetail() {
  const { data, loading, error } = useAsync(async () => {
    const gi = await fetchGithubInsights();
    const alertsByRepo = await Promise.all(
      gi.repos.map((r) =>
        fetchDependabotAlerts(r.fullName)
          .then((a) => ({ repo: r.fullName, alerts: a.alerts }))
          .catch(() => ({ repo: r.fullName, alerts: [] as DependabotAlertDetail[] }))
      )
    );
    return { gi, alertsByRepo };
  });

  const s = summarize(data?.gi ?? null);
  const allAlerts = (data?.alertsByRepo ?? [])
    .flatMap((r) => r.alerts.map((a) => ({ ...a, repo: r.repo.split("/").pop() ?? r.repo })))
    .sort((a, b) => order.indexOf(a.severity) - order.indexOf(b.severity));
  const donut = order
    .map((k) => ({ label: k[0].toUpperCase() + k.slice(1), value: (s as unknown as Record<string, number>)[k] as number, color: SEV[k] }))
    .filter((x) => x.value > 0);

  return (
    <DetailShell
      eyebrow="Dependabot & CI"
      title="Security"
      right={
        <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: s.tone === "red" ? "#D8392B" : s.tone === "amber" ? "#E8581A" : "#1F9D55" }}>
          {s.critical > 0 ? <ShieldAlert className="size-4" /> : <ShieldCheck className="size-4" />}
          {s.critical > 0 ? "At risk" : s.tone === "amber" ? "Needs attention" : "Secure"}
        </span>
      }
    >
      {loading ? (
        <Skeleton className="h-48 w-full rounded-[20px]" />
      ) : error ? (
        <Panel><p className="text-sm text-muted-foreground">Security data unavailable.</p></Panel>
      ) : (
        <Stagger className="space-y-4">
          <Reveal>
            <Panel>
              <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
                <div className="flex justify-center">
                  <RadialGauge value={s.posture} max={100} label={`Posture · ${s.grade}`} tone={s.tone === "red" ? "#D8392B" : s.tone === "amber" ? "#E8581A" : "#22C55E"} />
                </div>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                  {order.map((k) => (
                    <HeroNumber key={k} label={k} value={<AnimatedNumber value={(s as unknown as Record<string, number>)[k] as number} />} />
                  ))}
                </div>
              </div>
            </Panel>
          </Reveal>

          <div className="grid gap-4 lg:grid-cols-2">
            <Reveal>
              <Panel title="By severity">{donut.length ? <Donut segments={donut} /> : <p className="text-sm text-muted-foreground">No open alerts. 🎉</p>}</Panel>
            </Reveal>
            <Reveal>
              <Panel title="Per repository">
                <ul className="space-y-2.5">
                  {s.repos.map((r) => (
                    <li key={r.fullName} className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2 text-foreground">
                        <span className="size-2 rounded-full" style={{ backgroundColor: r.critical ? "#D8392B" : r.high ? "#E8581A" : "#22C55E" }} />
                        {r.shortName}
                      </span>
                      <span className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span style={{ color: r.critical ? "#D8392B" : undefined }}>{r.critical} crit</span>
                        <span>{r.high} high</span>
                        <span>CI {r.ciOk === false ? "failing" : "ok"}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </Reveal>
          </div>

          <Reveal>
            <Panel title={`Open alerts${allAlerts.length ? ` · ${allAlerts.length}` : ""}`}>
              {allAlerts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No open Dependabot alerts across repositories. 🎉</p>
              ) : (
                <div className="-mx-2 overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                        <th className="px-2 py-2 font-medium">Severity</th>
                        <th className="px-2 py-2 font-medium">Package</th>
                        <th className="px-2 py-2 font-medium">Repo</th>
                        <th className="px-2 py-2 font-medium">Vulnerable</th>
                        <th className="px-2 py-2 font-medium">Fixed in</th>
                        <th className="px-2 py-2 font-medium">CVE</th>
                        <th className="px-2 py-2 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {allAlerts.map((a) => (
                        <tr key={`${a.repo}-${a.id}`} className="border-t border-line">
                          <td className="px-2 py-2"><span className="font-semibold capitalize" style={{ color: SEV[a.severity] }}>{a.severity}</span></td>
                          <td className="px-2 py-2 text-foreground">{a.packageName} <span className="text-muted-foreground">({a.ecosystem})</span></td>
                          <td className="px-2 py-2 text-muted-foreground">{a.repo}</td>
                          <td className="px-2 py-2 text-muted-foreground">{a.vulnerableRange}</td>
                          <td className="px-2 py-2 text-muted-foreground">{a.fixedVersion ?? "—"}</td>
                          <td className="px-2 py-2 text-muted-foreground">{a.cve ?? a.ghsa ?? "—"}</td>
                          <td className="px-2 py-2"><a href={a.url} target="_blank" rel="noopener noreferrer" className="text-primary"><ExternalLink className="size-3.5" /></a></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Panel>
          </Reveal>
        </Stagger>
      )}
    </DetailShell>
  );
}
