import { GithubDetail } from "@/components/staff/analytics/details/github-detail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function GithubDetailPage({ params }: { params: Promise<{ repo: string }> }) {
  const { repo } = await params;
  return <GithubDetail repo={decodeURIComponent(repo)} />;
}
