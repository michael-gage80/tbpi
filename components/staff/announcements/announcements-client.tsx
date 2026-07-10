"use client";

import { useState } from "react";
import { Pin, Trash2, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { PageHeading } from "@/components/staff/ui/page-heading";
import { useSharedAnnouncements } from "@/components/staff/firestore-hooks";
import { announcementsApi } from "@/components/staff/api";
import type { Role, SharedAnnouncement } from "@/lib/firebase/types";

function Composer() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pinned, setPinned] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Title and body are required.");
      return;
    }
    setBusy(true);
    try {
      await announcementsApi.create({ title: title.trim(), body: body.trim(), pinned });
      toast.success("Announcement posted.");
      setOpen(false);
      setTitle("");
      setBody("");
      setPinned(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not post.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" /> New announcement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New announcement</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="a-title">Title</Label>
            <Input id="a-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="a-body">Body</Label>
            <Textarea id="a-body" value={body} onChange={(e) => setBody(e.target.value)} rows={4} required />
          </div>
          <div className="flex items-center gap-2">
            <Switch id="a-pin" checked={pinned} onCheckedChange={setPinned} />
            <Label htmlFor="a-pin">Pin to top</Label>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy}>
              {busy ? "Posting…" : "Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AnnouncementCard({ a, isAdmin }: { a: SharedAnnouncement; isAdmin: boolean }) {
  async function remove() {
    try {
      await announcementsApi.remove(a.id);
      toast.success("Deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    }
  }
  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="mb-1 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {a.pinned && <Pin className="size-3.5 text-primary" />}
          <h3 className="text-base font-semibold text-foreground">{a.title}</h3>
        </div>
        {isAdmin && (
          <button onClick={remove} aria-label="Delete announcement" className="rounded p-1 text-muted-foreground hover:text-destructive">
            <Trash2 className="size-3.5" />
          </button>
        )}
      </div>
      <p className="whitespace-pre-wrap text-sm text-foreground/80">{a.body}</p>
      <p className="mt-3 text-xs text-muted-foreground">
        {a.createdByEmail}
        {a.createdAt ? ` · ${formatDistanceToNow(a.createdAt, { addSuffix: true })}` : ""}
      </p>
    </article>
  );
}

export function AnnouncementsClient({ role }: { role: Role }) {
  const { data, loading, error } = useSharedAnnouncements();
  const isAdmin = role === "admin";
  const sorted = [...data].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned));

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeading title="Announcements" subtitle="Team-wide notices, pinned first." />
        {isAdmin && <Composer />}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-muted-foreground">Couldn’t load announcements — {error}</p>
      ) : sorted.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No announcements yet.
        </p>
      ) : (
        <div className="space-y-4">
          {sorted.map((a) => (
            <AnnouncementCard key={a.id} a={a} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
}
