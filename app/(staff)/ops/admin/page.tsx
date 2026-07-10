import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { PageHeading } from "@/components/staff/ui/page-heading";
import { UsersClient } from "@/components/staff/admin/users-client";
import { AnnouncementsClient } from "@/components/staff/announcements/announcements-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/ops");

  return (
    <div className="space-y-8">
      <PageHeading title="Admin" subtitle="Manage your team and announcements." />
      <UsersClient selfUid={session.uid} />
      <AnnouncementsClient role={session.role} />
    </div>
  );
}
