"use client";

import { useState, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tasksApi } from "@/components/staff/api";
import type { SharedTask } from "@/lib/firebase/types";

function toDateInput(millis?: number | null): string {
  if (!millis) return "";
  const d = new Date(millis);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function TaskDialog({ trigger, task }: { trigger: ReactNode; task?: SharedTask }) {
  const editing = !!task;
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [assigneeName, setAssigneeName] = useState("");
  const [assigneeEmail, setAssigneeEmail] = useState("");
  const [priority, setPriority] = useState<string>("none");
  const [due, setDue] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open && task) {
      setTitle(task.title);
      setNotes(task.notes ?? "");
      setAssigneeName(task.assigneeName ?? "");
      setAssigneeEmail(task.assigneeEmail ?? "");
      setPriority(task.priority ?? "none");
      setDue(toDateInput(task.dueAt));
    } else if (open && !task) {
      setTitle("");
      setNotes("");
      setAssigneeName("");
      setAssigneeEmail("");
      setPriority("none");
      setDue("");
    }
  }, [open, task]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    setBusy(true);
    const payload: Record<string, unknown> = {
      title: title.trim(),
      notes: notes.trim(),
      assigneeName: assigneeName.trim() || null,
      assigneeEmail: assigneeEmail.trim() || null,
      priority: priority === "none" ? undefined : priority,
      dueAt: due ? new Date(due).getTime() : null,
    };
    try {
      if (editing) {
        await tasksApi.update({ id: task!.id, ...payload });
        toast.success("Task updated.");
      } else {
        await tasksApi.create(payload);
        toast.success("Task added.");
      }
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save task.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit task" : "New task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="t-title">Title</Label>
            <Input id="t-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-notes">Notes</Label>
            <Textarea id="t-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="t-assignee">Assignee name</Label>
              <Input id="t-assignee" value={assigneeName} onChange={(e) => setAssigneeName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-email">Assignee email</Label>
              <Input id="t-email" type="email" value={assigneeEmail} onChange={(e) => setAssigneeEmail(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-due">Due</Label>
              <Input id="t-due" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : editing ? "Save changes" : "Add task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
