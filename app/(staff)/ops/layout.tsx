import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { DashboardShell } from "@/components/staff/dashboard-shell";

export const runtime = "nodejs";
// Session state is per-request; never statically cache the dashboard.
export const dynamic = "force-dynamic";

export default async function StaffLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return <DashboardShell session={session}>{children}</DashboardShell>;
}
