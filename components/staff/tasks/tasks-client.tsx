"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeading } from "@/components/staff/ui/page-heading";
import { Chip } from "@/components/staff/ui/primitives";
import { TaskDialog } from "@/components/staff/tasks/task-dialog";
import { useSharedTasks } from "@/components/staff/firestore-hooks";
import { tasksApi } from "@/components/staff/api";
import { cn } from "@/lib/utils";
import type { SharedTask } from "@/lib/firebase/types";

function dueLabel(millis?: number | null): string | null {
  if (!millis) return null;
  return new Date(millis).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function TaskRow({ task }: { task: SharedTask }) {
  const [pending, setPending] = useState(false);

  async function toggle(done: boolean) {
    setPending(true);
    try {
      await tasksApi.update({ id: task.id, done });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setPending(false);
    }
  }

  async function remove() {
    setPending(true);
    try {
      await tasksApi.remove(task.id);
      toast.success("Task deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
      setPending(false);
    }
  }

  const due = dueLabel(task.dueAt);

  return (
    <div className="flex items-start gap-3 border-b border-border py-3 last:border-b-0">
      <Checkbox
        checked={task.done}
        disabled={pending}
        onCheckedChange={(v) => toggle(!!v)}
        className="mt-0.5"
        aria-label={task.done ? "Mark incomplete" : "Mark complete"}
      />
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-medium text-foreground", task.done && "text-muted-foreground line-through")}>
          {task.title}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {task.assigneeName && <span>{task.assigneeName}</span>}
          {due && <span>Due {due}</span>}
          {task.priority && <Chip kind={task.priority} />}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <TaskDialog
          task={task}
          trigger={
            <button aria-label="Edit task" className="rounded p-1 text-muted-foreground hover:text-foreground">
              <Pencil className="size-3.5" />
            </button>
          }
        />
        <button
          onClick={remove}
          disabled={pending}
          aria-label="Delete task"
          className="rounded p-1 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export function TasksClient() {
  const { data, loading, error } = useSharedTasks();
  const open = data.filter((t) => !t.done);
  const done = data.filter((t) => t.done);

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeading title="Tasks" subtitle="Shared across the team, in real time." />
        <TaskDialog
          trigger={
            <Button size="sm">
              <Plus className="size-4" /> Add task
            </Button>
          }
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-muted-foreground">Couldn’t load tasks — {error}</p>
      ) : data.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No tasks yet. Add the first one.
        </p>
      ) : (
        <div className="space-y-8">
          <section>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              Open · {open.length}
            </p>
            <div className="rounded-xl border border-border bg-card px-4">
              {open.length ? (
                open.map((t) => <TaskRow key={t.id} task={t} />)
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">All done. 🎉</p>
              )}
            </div>
          </section>

          {done.length > 0 && (
            <section>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Completed · {done.length}
              </p>
              <div className="rounded-xl border border-border bg-card px-4">
                {done.map((t) => (
                  <TaskRow key={t.id} task={t} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
