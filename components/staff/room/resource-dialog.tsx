"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { toast } from "sonner";
import { Paperclip, LinkIcon } from "lucide-react";
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
import { cn } from "@/lib/utils";
import {
  resourcesApi,
  fileToBase64,
  CATEGORY_META,
  CATEGORY_ORDER,
  formatFileSize,
  MAX_FILE_BYTES,
} from "@/components/staff/room/resources-api";
import type { ResourceCategory, ResourceKind, RoomResource } from "@/lib/firebase/types";

export function ResourceDialog({
  trigger,
  resource,
  onSaved,
}: {
  trigger: ReactNode;
  resource?: RoomResource;
  onSaved: () => void;
}) {
  const editing = !!resource;
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<ResourceKind>("file");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ResourceCategory>("brand");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    if (resource) {
      setKind(resource.kind);
      setTitle(resource.title);
      setDescription(resource.description ?? "");
      setCategory(resource.category);
      setUrl(resource.kind === "link" ? resource.url : "");
    } else {
      setKind("file");
      setTitle("");
      setDescription("");
      setCategory("brand");
      setUrl("");
    }
    setFile(null);
  }, [open, resource]);

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
      if (editing) {
        await resourcesApi.update({ id: resource!.id, title: title.trim(), description: description.trim(), category });
        toast.success("Resource updated.");
      } else if (kind === "file") {
        if (!file) throw new Error("Choose a file to upload.");
        const fileBase64 = await fileToBase64(file);
        await resourcesApi.create({
          title: title.trim(),
          description: description.trim(),
          category,
          kind: "file",
          fileBase64,
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
        });
        toast.success("Resource added.");
      } else {
        if (!url.trim()) throw new Error("Enter a link.");
        await resourcesApi.create({ title: title.trim(), description: description.trim(), category, kind: "link", url: url.trim() });
        toast.success("Resource added.");
      }
      setOpen(false);
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save resource.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit resource" : "Add resource"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          {!editing && (
            <div className="grid grid-cols-2 gap-2">
              {(["file", "link"] as ResourceKind[]).map((k) => {
                const Icon = k === "file" ? Paperclip : LinkIcon;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKind(k)}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors",
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
          )}

          {!editing && kind === "file" && (
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
          )}

          {!editing && kind === "link" && (
            <div className="space-y-1.5">
              <Label htmlFor="r-url">Link</Label>
              <Input
                id="r-url"
                type="url"
                placeholder="https://…"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="r-title">Title</Label>
            <Input id="r-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="r-desc">Description</Label>
            <Textarea id="r-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
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
              {busy ? "Saving…" : editing ? "Save changes" : "Add resource"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
