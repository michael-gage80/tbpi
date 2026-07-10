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
import { eventsApi } from "@/components/staff/api";
import type { SharedEvent } from "@/lib/firebase/types";

function toLocalInput(millis?: number): string {
  if (!millis) return "";
  const d = new Date(millis);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventDialog({
  trigger,
  event,
  defaultDate,
}: {
  trigger: ReactNode;
  event?: SharedEvent;
  defaultDate?: Date;
}) {
  const editing = !!event;
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [category, setCategory] = useState("event");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (event) {
      setTitle(event.title);
      setStart(toLocalInput(event.start));
      setEnd(toLocalInput(event.end));
      setCategory(event.category ?? "event");
      setLocation(event.location ?? "");
      setNotes(event.notes ?? "");
    } else {
      const base = defaultDate ? new Date(defaultDate) : new Date();
      if (defaultDate) base.setHours(9, 0, 0, 0);
      setTitle("");
      setStart(toLocalInput(base.getTime()));
      setEnd(toLocalInput(base.getTime() + 60 * 60 * 1000));
      setCategory("event");
      setLocation("");
      setNotes("");
    }
  }, [open, event, defaultDate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !start) {
      toast.error("Title and start time are required.");
      return;
    }
    setBusy(true);
    const payload: Record<string, unknown> = {
      title: title.trim(),
      start: new Date(start).getTime(),
      end: end ? new Date(end).getTime() : new Date(start).getTime(),
      category,
      location: location.trim() || null,
      notes: notes.trim() || null,
    };
    try {
      if (editing) {
        await eventsApi.update({ id: event!.id, ...payload });
        toast.success("Event updated.");
      } else {
        await eventsApi.create(payload);
        toast.success("Event added.");
      }
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save event.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit event" : "New event"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="e-title">Title</Label>
            <Input id="e-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="e-start">Start</Label>
              <Input id="e-start" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="e-end">End</Label>
              <Input id="e-end" type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="e-loc">Location</Label>
              <Input id="e-loc" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="e-notes">Notes</Label>
            <Textarea id="e-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : editing ? "Save changes" : "Add event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
