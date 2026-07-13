import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { RoomShell } from "@/components/staff/room/room-shell";

export const runtime = "nodejs";
// Session state is per-request; never statically cache the staff room.
export const dynamic = "force-dynamic";

export default async function RoomLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return <RoomShell session={session}>{children}</RoomShell>;
}
