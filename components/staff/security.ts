"use client";

import { useAsync } from "@/components/staff/use-async";
import { fetchGithubInsights } from "@/lib/org/callables";
import type { GitHubInsights, RepoInsights } from "@/lib/firebase/types";

export interface RepoSecurity {
  fullName: string;
  shortName: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  ciOk: boolean | null;
}

export interface SecuritySummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  repos: RepoSecurity[];
  ciFailing: number;
  /** 0–100 posture score. */
  posture: number;
  grade: string;
  tone: "green" | "amber" | "red";
}

const shortName = (full: string) => full.split("/").pop() ?? full;

export function summarize(insights: GitHubInsights | null): SecuritySummary {
  const repos: RepoSecurity[] = (insights?.repos ?? []).map((r: RepoInsights) => ({
    fullName: r.fullName,
    shortName: shortName(r.fullName),
    critical: r.dependabot?.critical ?? 0,
    high: r.dependabot?.high ?? 0,
    medium: r.dependabot?.medium ?? 0,
    low: r.dependabot?.low ?? 0,
    ciOk: r.ciSuccessRatePct == null ? null : r.ciSuccessRatePct >= 80,
  }));

  const critical = repos.reduce((a, r) => a + r.critical, 0);
  const high = repos.reduce((a, r) => a + r.high, 0);
  const medium = repos.reduce((a, r) => a + r.medium, 0);
  const low = repos.reduce((a, r) => a + r.low, 0);
  const ciFailing = repos.filter((r) => r.ciOk === false).length;

  // Posture: start at 100, penalise by severity + CI health.
  let posture = 100 - critical * 28 - high * 9 - medium * 2 - low * 0.5 - ciFailing * 6;
  posture = Math.max(0, Math.min(100, Math.round(posture)));

  const grade =
    posture >= 95 ? "A+" : posture >= 90 ? "A" : posture >= 80 ? "B" : posture >= 70 ? "C" : posture >= 55 ? "D" : "F";
  const tone: "green" | "amber" | "red" = critical > 0 ? "red" : high > 0 || ciFailing > 0 ? "amber" : "green";

  return { critical, high, medium, low, repos, ciFailing, posture, grade, tone };
}

export function useSecurity() {
  const { data, loading, error } = useAsync(fetchGithubInsights);
  return { summary: summarize(data), loading, error };
}
