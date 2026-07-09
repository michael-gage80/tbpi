import { StatusClient } from "@/components/staff/analytics/status-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function StatusPage() {
  return <StatusClient />;
}
