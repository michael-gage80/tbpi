import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ProfileClient } from "@/components/staff/profile/profile-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  return <ProfileClient session={session} />;
}
