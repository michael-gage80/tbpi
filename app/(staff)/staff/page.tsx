import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { OverviewClient } from "@/components/staff/overview/overview-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  return <OverviewClient session={session} />;
}
