import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AnnouncementsClient } from "@/components/staff/announcements/announcements-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/staff");

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">Admin</p>
      <AnnouncementsClient role={session.role} />
    </div>
  );
}
