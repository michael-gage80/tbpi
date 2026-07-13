import { getSession } from "@/lib/auth/session";
import { ResourcesClient } from "@/components/staff/room/resources-client";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const session = await getSession();
  return <ResourcesClient isAdmin={session?.role === "admin"} />;
}
