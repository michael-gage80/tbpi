import { WebsiteDetail } from "@/components/staff/analytics/details/website-detail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function WebsiteProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <WebsiteDetail projectId={decodeURIComponent(projectId)} />;
}
