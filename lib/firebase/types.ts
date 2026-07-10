// Shared wire types. Callable shapes mirror the ops repo `functions/src/types.ts`
// (camelCase, ISO8601 date strings). Firestore doc shapes mirror STAFF_DASHBOARD_SPEC §4.

/* ---------- systemStatus ---------- */
export type DeployState = "ready" | "building" | "error" | "queued";

export interface WebVitals {
  source: string;
  lcpMs: number | null;
  cls: number | null;
  inpMs: number | null;
  rating: string | null;
  measuredAt: string | null;
}

export interface VercelProjectStatus {
  id: string;
  name: string;
  domain: string;
  url: string;
  state: DeployState;
  buildSeconds: number;
  lastDeployDate: string;
  hasAnalytics: boolean;
  visitors7d: number;
  visitorsDeltaPct: number;
  sparkline: number[];
  topPage: string;
  performanceScore: number;
  lcpSeconds: number;
  vitals?: WebVitals | null;
}

export interface GitHubRepoStatus {
  fullName: string;
  checksPass: boolean;
  defaultBranch: string;
  lastCommitMessage: string;
  lastCommitDate: string;
  openPRs: number;
  openIssues: number;
}

export interface ZohoStatus {
  address: string;
  mailboxes: number;
  operational: boolean;
  uptimePct: number;
  incidents: number;
  checkedAt: string;
}

export interface SystemStatusSnapshot {
  repos: GitHubRepoStatus[];
  vercel: VercelProjectStatus[];
  zoho: ZohoStatus;
}

/* ---------- searchConsoleSnapshot ---------- */
export interface SearchRow {
  label: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchDayPoint {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchConsoleSnapshot {
  property?: string;
  days?: number;
  series?: SearchDayPoint[];
  clicks?: number;
  clicksDeltaPct?: number;
  impressions?: number;
  impressionsDeltaPct?: number;
  avgCtr?: number;
  avgPosition?: number;
  topQueries?: SearchRow[];
  topPages?: SearchRow[];
  countries?: SearchRow[];
  devices?: SearchRow[];
  updatedAt?: string | null;
}

/* ---------- githubInsights ---------- */
export interface StuckPR {
  number: number;
  title: string;
  author: string;
  openedAt: string;
  lastActivityAt: string;
  url: string;
}

export interface DependabotAlert {
  id: number;
  severity: string;
  package: string;
  summary: string;
  url: string;
}

export interface DependabotSummary {
  available: boolean;
  critical: number;
  high: number;
  medium: number;
  low: number;
  alerts: DependabotAlert[];
}

export interface UntriagedIssue {
  number: number;
  title: string;
  openedAt: string;
  url: string;
}

export interface RepoRelease {
  tag: string;
  publishedAt: string;
  url: string;
}

export interface RepoInsights {
  fullName: string;
  awaitingReviewCount: number;
  stuckPRs: StuckPR[];
  avgTimeToMergeHours: number | null;
  dependabot: DependabotSummary;
  issuesOpen: number;
  issuesNewThisWeek: number;
  oldestUntriaged: UntriagedIssue | null;
  latestRelease: RepoRelease | null;
  ciSuccessRatePct: number | null;
}

export interface GitHubInsights {
  repos: RepoInsights[];
  updatedAt: string | null;
}

/* ---------- linkedInSnapshot ---------- */
export interface LinkedInPost {
  id: string;
  text: string;
  url: string;
  publishedAt: string | null;
  thumbnailURL: string | null;
  likes: number | null;
  comments: number | null;
}

export interface LinkedInAnalytics {
  pageViews30d: number | null;
  followers: number | null;
  followerGain30d: number | null;
  impressions30d: number | null;
  engagements30d: number | null;
  engagementRate: number | null;
}

export interface LinkedInSnapshot {
  latestPost: LinkedInPost | null;
  analytics: LinkedInAnalytics | null;
  source: string;
  updatedAt: string | null;
}

/* ---------- Firestore shared docs (client-shaped: Timestamps -> millis on read) ---------- */
export interface SharedTask {
  id: string;
  title: string;
  notes?: string;
  done: boolean;
  assigneeEmail?: string;
  assigneeName?: string;
  priority?: "high" | "medium" | "low";
  project?: string;
  createdBy: string;
  createdByEmail: string;
  createdAt: number | null;
  dueAt?: number | null;
  completedBy?: string;
  completedAt?: number | null;
}

export interface SharedEvent {
  id: string;
  title: string;
  start: number;
  end: number;
  allDay: boolean;
  category?: "event" | "meeting" | "deadline";
  location?: string;
  notes?: string;
  createdBy: string;
  createdByEmail: string;
  createdAt: number | null;
}

export interface SharedAnnouncement {
  id: string;
  title: string;
  body: string;
  pinned?: boolean;
  createdBy: string;
  createdByEmail: string;
  createdAt: number | null;
}

/* ---------- Session ---------- */
export type Role = "admin" | "staff";
export interface Session {
  uid: string;
  email: string;
  role: Role;
}
