import { TasksClient } from "@/components/staff/tasks/tasks-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function TasksPage() {
  return <TasksClient />;
}
