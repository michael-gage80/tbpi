import { getSession } from "@/lib/auth/session";
import { RoomHome } from "@/components/staff/room/room-home";

export const dynamic = "force-dynamic";

export default async function RoomPage() {
  // Layout already guarantees a session (redirects otherwise).
  const session = await getSession();
  return <RoomHome session={session!} />;
}
