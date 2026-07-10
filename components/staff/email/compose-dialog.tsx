"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { Bold, Italic, List, Link2, Paperclip, X, Send } from "lucide-react";
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
import { mail } from "@/components/staff/email/mail-api";

export interface ComposeInit {
  to?: string;
  cc?: string;
  subject?: string;
  bodyHtml?: string;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ComposeDialog({
  trigger,
  init,
  onSent,
}: {
  trigger: ReactNode;
  init?: ComposeInit;
  onSent?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [attachments, setAttachments] = useState<{ name: string; ref: unknown }[]>([]);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setTo(init?.to ?? "");
    setCc(init?.cc ?? "");
    setSubject(init?.subject ?? "");
    setShowCc(!!init?.cc);
    setAttachments([]);
    setConfirming(false);
    // Body is set imperatively once the editable div mounts.
    requestAnimationFrame(() => {
      if (bodyRef.current) bodyRef.current.innerHTML = init?.bodyHtml ?? "";
    });
  }, [open, init]);

  function exec(cmd: string, value?: string) {
    bodyRef.current?.focus();
    document.execCommand(cmd, false, value);
  }

  async function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    for (const f of files) {
      try {
        const b64 = await fileToBase64(f);
        const ref = await mail.uploadAttachment(f.name, b64, f.type || "application/octet-stream");
        setAttachments((a) => [...a, { name: f.name, ref }]);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : `Couldn’t attach ${f.name}.`);
      }
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  const parseList = (s: string) => s.split(/[,;]/).map((x) => x.trim()).filter(Boolean);

  async function doSend() {
    const toList = parseList(to);
    if (toList.length === 0) {
      toast.error("Add at least one recipient.");
      setConfirming(false);
      return;
    }
    setBusy(true);
    try {
      await mail.send({
        to: toList,
        cc: parseList(cc),
        subject: subject.trim(),
        body: bodyRef.current?.innerHTML ?? "",
        attachments: attachments.map((a) => a.ref),
      });
      toast.success("Email sent.");
      setOpen(false);
      onSent?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Send failed.");
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="c-to" className="w-12 text-muted-foreground">To</Label>
            <Input id="c-to" value={to} onChange={(e) => setTo(e.target.value)} placeholder="name@example.org" />
            {!showCc && (
              <button type="button" onClick={() => setShowCc(true)} className="shrink-0 text-xs font-medium text-primary">
                Cc
              </button>
            )}
          </div>
          {showCc && (
            <div className="flex items-center gap-2">
              <Label htmlFor="c-cc" className="w-12 text-muted-foreground">Cc</Label>
              <Input id="c-cc" value={cc} onChange={(e) => setCc(e.target.value)} />
            </div>
          )}
          <div className="flex items-center gap-2">
            <Label htmlFor="c-subj" className="w-12 text-muted-foreground">Subject</Label>
            <Input id="c-subj" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-1 border-y border-line py-1.5">
            <button type="button" onClick={() => exec("bold")} className="rounded p-1.5 hover:bg-accent" aria-label="Bold"><Bold className="size-4" /></button>
            <button type="button" onClick={() => exec("italic")} className="rounded p-1.5 hover:bg-accent" aria-label="Italic"><Italic className="size-4" /></button>
            <button type="button" onClick={() => exec("insertUnorderedList")} className="rounded p-1.5 hover:bg-accent" aria-label="List"><List className="size-4" /></button>
            <button type="button" onClick={() => { const url = prompt("Link URL"); if (url) exec("createLink", url); }} className="rounded p-1.5 hover:bg-accent" aria-label="Link"><Link2 className="size-4" /></button>
            <button type="button" onClick={() => fileRef.current?.click()} className="rounded p-1.5 hover:bg-accent" aria-label="Attach"><Paperclip className="size-4" /></button>
            <input ref={fileRef} type="file" multiple hidden onChange={onPickFiles} />
          </div>

          {/* Body */}
          <div
            ref={bodyRef}
            contentEditable
            suppressContentEditableWarning
            className="min-h-40 max-h-72 overflow-y-auto rounded-lg border border-line2 p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/40 [&_a]:text-primary [&_a]:underline"
          />

          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachments.map((a, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-chip px-3 py-1 text-xs">
                  <Paperclip className="size-3" /> {a.name}
                  <button onClick={() => setAttachments((prev) => prev.filter((_, j) => j !== i))} aria-label="Remove"><X className="size-3" /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="items-center">
          {confirming ? (
            <div className="flex w-full items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">Send this email?</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setConfirming(false)} disabled={busy}>Cancel</Button>
                <Button size="sm" onClick={doSend} disabled={busy}>{busy ? "Sending…" : "Confirm send"}</Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setConfirming(true)}>
              <Send className="size-4" /> Send
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
