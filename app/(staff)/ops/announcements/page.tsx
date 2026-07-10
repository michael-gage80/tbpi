import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AnnouncementsClient } from "@/components/staff/announcements/announcements-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  return <AnnouncementsClient role={session.role} />;
}
