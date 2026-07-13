"use client";

import { useState, useRef, type ReactNode } from "react";
import { toast } from "sonner";
import { Paperclip, LinkIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
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
import { cn } from "@/lib/utils";
import {
  submissionsApi,
  fileToBase64,
  CATEGORY_META,
  CATEGORY_ORDER,
  formatFileSize,
  MAX_FILE_BYTES,
} from "@/components/staff/room/resources-api";
import type { ResourceCategory, ResourceKind } from "@/lib/firebase/types";

export function SubmitDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<ResourceKind>("file");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ResourceCategory>("brand");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function reset() {
    setKind("file");
    setTitle("");
    setDescription("");
    setCategory("brand");
    setUrl("");
    setFile(null);
  }

  function pickFile(f: File | null) {
    if (f && f.size > MAX_FILE_BYTES) {
      toast.error("File too large (max 3MB for now).");
      return;
    }
    setFile(f);
    if (f && !title.trim()) setTitle(f.name.replace(/\.[^.]+$/, ""));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required.");
    setBusy(true);
    try {
      if (kind === "file") {
        if (!file) throw new Error("Choose a file to submit.");
        const fileBase64 = await fileToBase64(file);
        await submissionsApi.submit({
          title: title.trim(),
          description: description.trim(),
          suggestedCategory: category,
          kind: "file",
          fileBase64,
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
        });
      } else {
        if (!url.trim()) throw new Error("Enter a link.");
        await submissionsApi.submit({
          title: title.trim(),
          description: description.trim(),
          suggestedCategory: category,
          kind: "link",
          url: url.trim(),
        });
      }
      toast.success("Thanks! Your submission is with the team for review.");
      setOpen(false);
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit a resource</DialogTitle>
          <DialogDescription>
            Share a document or link for the team. An admin will review it before it appears in the hub.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {(["file", "link"] as ResourceKind[]).map((k) => {
              const Icon = k === "file" ? Paperclip : LinkIcon;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    kind === k
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-accent/50"
                  )}
                >
                  <Icon className="size-4" />
                  {k === "file" ? "Upload file" : "External link"}
                </button>
              );
            })}
          </div>

          {kind === "file" ? (
            <div className="space-y-1.5">
              <Label>File</Label>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-3 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Paperclip className="size-4 shrink-0" />
                {file ? (
                  <span className="truncate">
                    {file.name} <span className="text-xs">({formatFileSize(file.size)})</span>
                  </span>
                ) : (
                  <span>Choose a file — PDF, doc, image (max 3MB)</span>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="s-url">Link</Label>
              <Input id="s-url" type="url" placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="s-title">Title</Label>
            <Input id="s-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="s-desc">Description</Label>
            <Textarea
              id="s-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="What is it, and why is it useful?"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Suggested category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as ResourceCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_ORDER.map((c) => (
                  <SelectItem key={c} value={c}>
                    {CATEGORY_META[c].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy}>
              {busy ? "Submitting…" : "Submit for review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
