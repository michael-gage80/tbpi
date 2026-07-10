"use client";

import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase/client";
import type {
  SystemStatusSnapshot,
  SearchConsoleSnapshot,
  GitHubInsights,
  LinkedInSnapshot,
  WebsiteAnalytics,
  DeployHistory,
  CodebaseAnalytics,
  DependabotAlertList,
  SearchQueryResult,
} from "@/lib/firebase/types";

// These callables (us-central1) enforce requireStaff on the server. They are
// invoked as the signed-in staff user via the client SDK — the browser already
// holds a Firebase Auth session for realtime reads, and these return only
// staff-visible org analytics (never mail/admin data).

export async function fetchSystemStatus(): Promise<SystemStatusSnapshot> {
  const res = await httpsCallable<void, SystemStatusSnapshot>(functions, "systemStatus")();
  return res.data;
}

export async function fetchSearchConsoleSnapshot(): Promise<SearchConsoleSnapshot> {
  const res = await httpsCallable<void, SearchConsoleSnapshot>(
    functions,
    "searchConsoleSnapshot"
  )();
  return res.data;
}

export async function fetchGithubInsights(): Promise<GitHubInsights> {
  const res = await httpsCallable<void, GitHubInsights>(functions, "githubInsights")();
  return res.data;
}

export async function fetchLinkedInSnapshot(): Promise<LinkedInSnapshot> {
  const res = await httpsCallable<void, LinkedInSnapshot>(functions, "linkedInSnapshot")();
  return res.data;
}

/* ---- Drill-down callables (detail views) ---- */
export async function fetchWebsiteAnalytics(projectId: string, days = 30): Promise<WebsiteAnalytics> {
  const res = await httpsCallable<{ projectId: string; days: number }, WebsiteAnalytics>(
    functions,
    "websiteAnalytics"
  )({ projectId, days });
  return res.data;
}

export async function fetchDeployHistory(projectId: string): Promise<DeployHistory> {
  const res = await httpsCallable<{ projectId: string }, DeployHistory>(functions, "deployHistory")({
    projectId,
  });
  return res.data;
}

export async function fetchCodebaseAnalytics(fullName: string): Promise<CodebaseAnalytics> {
  const res = await httpsCallable<{ fullName: string }, CodebaseAnalytics>(
    functions,
    "codebaseAnalytics"
  )({ fullName });
  return res.data;
}

export async function fetchDependabotAlerts(fullName: string): Promise<DependabotAlertList> {
  const res = await httpsCallable<{ fullName: string }, DependabotAlertList>(
    functions,
    "dependabotAlerts"
  )({ fullName });
  return res.data;
}

export async function fetchSearchConsoleQuery(
  startDate: string,
  endDate: string,
  dimension: string
): Promise<SearchQueryResult> {
  const res = await httpsCallable<
    { startDate: string; endDate: string; dimension: string },
    SearchQueryResult
  >(functions, "searchConsoleQuery")({ startDate, endDate, dimension });
  return res.data;
}
