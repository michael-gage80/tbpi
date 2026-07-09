"use client";

import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase/client";
import type {
  SystemStatusSnapshot,
  SearchConsoleSnapshot,
  GitHubInsights,
  LinkedInSnapshot,
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
