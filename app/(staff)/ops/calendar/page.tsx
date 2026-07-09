import { CalendarClient } from "@/components/staff/calendar/calendar-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function CalendarPage() {
  return <CalendarClient />;
}
