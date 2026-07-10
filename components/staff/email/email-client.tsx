"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import {
  PenSquare,
  RefreshCw,
  Reply,
  Forward,
  Trash2,
  Check,
  MailOpen,
  Paperclip,
  ArrowLeft,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeading } from "@/components/staff/ui/page-heading";
import { Chip } from "@/components/staff/ui/primitives";
import Link from "next/link";
import { ComposeDialog, type ComposeInit } from "@/components/staff/email/compose-dialog";
import { mail, ZOHO_NOT_CONNECTED } from "@/components/staff/email/mail-api";
import { cn } from "@/lib/utils";
import type { MailFolder, EmailThread, EmailMessage } from "@/lib/firebase/types";

const triageKind: Record<string, string> = { needsReply: "needsReply", fyi: "fyi", waitingOn: "waiting" };

function initials(name: string) {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
}
function when(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  return d.toDateString() === today.toDateString() ? format(d, "HH:mm") : format(d, "d MMM");
}

export function EmailClient() {
  const [folders, setFolders] = useState<MailFolder[]>([]);
  const [folderId, setFolderId] = useState("inbox");
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<EmailThread | null>(null);
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const [notConnected, setNotConnected] = useState(false);

  const currentFolder = folders.find((f) => f.id === folderId);
  const trashFolder = folders.find((f) => f.systemKind === "trash");

  const loadList = useCallback(async (fid: string, q?: string) => {
    setLoadingList(true);
    try {
      setThreads(await mail.list(fid, q));
      setNotConnected(false);
    } catch (err) {
      if (err instanceof Error && err.message === ZOHO_NOT_CONNECTED) {
        setNotConnected(true);
      } else {
        toast.error(err instanceof Error ? err.message : "Couldn’t load mail.");
      }
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    mail.folders().then(setFolders).catch(() => {});
    loadList("inbox");
  }, [loadList]);

  async function openThread(t: EmailThread) {
    setActive(t);
    setMessages([]);
    setLoadingThread(true);
    try {
      const msgs = await mail.thread(t.messageRefs);
      setMessages(msgs);
      if (t.unread) {
        await mail.markRead(t.messageRefs.map((r) => r.id), true).catch(() => {});
        setThreads((prev) => prev.map((x) => (x.id === t.id ? { ...x, unread: false } : x)));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn’t open message.");
    } finally {
      setLoadingThread(false);
    }
  }

  function selectFolder(fid: string) {
    setFolderId(fid);
    setActive(null);
    loadList(fid, search || undefined);
  }

  async function action(fn: () => Promise<unknown>, okMsg: string) {
    try {
      await fn();
      toast.success(okMsg);
      setActive(null);
      loadList(folderId, search || undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed.");
    }
  }

  const ids = active?.messageRefs.map((r) => r.id) ?? [];
  const isTrash = currentFolder?.systemKind === "trash";
  const replyInit = (msg: EmailMessage, forward = false): ComposeInit => ({
    to: forward ? "" : msg.from.email,
    subject: `${forward ? "Fwd: " : "Re: "}${active?.subject ?? ""}`,
    bodyHtml: `<br/><br/><blockquote style="border-left:2px solid #ccc;padding-left:12px;color:#666">${msg.bodyHtml}${msg.quotedHtml}</blockquote>`,
  });

  if (notConnected) {
    return (
      <div>
        <PageHeading title="Email" subtitle="Your TBPI inbox." />
        <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded-[20px] bg-card px-6 py-16 text-center shadow-card">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailOpen className="size-6" />
          </span>
          <div className="space-y-1">
            <h2 className="text-xl font-normal text-foreground" style={{ fontFamily: "var(--font-dm-serif)" }}>
              Connect your Zoho mailbox
            </h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              Link your own Zoho account to read and send mail from here. Your inbox stays private to you.
            </p>
          </div>
          <Button asChild>
            <Link href="/ops/profile">Connect in Profile</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <PageHeading title="Email" subtitle="Your TBPI inbox." />
        <div className="flex items-center gap-2">
          <Select value={folderId} onValueChange={selectFolder}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {folders.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.name}{f.unreadCount ? ` (${f.unreadCount})` : ""}
                </SelectItem>
              ))}
              {folders.length === 0 && <SelectItem value="inbox">Inbox</SelectItem>}
            </SelectContent>
          </Select>
          <ComposeDialog
            trigger={<Button size="sm"><PenSquare className="size-4" /> New</Button>}
            onSent={() => loadList(folderId, search || undefined)}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(320px,400px)_1fr]">
        {/* Thread list */}
        <div className={cn(active && "hidden lg:block")}>
          <form
            onSubmit={(e) => { e.preventDefault(); loadList(folderId, search || undefined); }}
            className="mb-3 flex items-center gap-2 rounded-full bg-card px-3 py-1.5 shadow-card"
          >
            <Search className="size-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search mail…" className="flex-1 bg-transparent text-sm outline-none" />
            <button type="button" onClick={() => loadList(folderId, search || undefined)} aria-label="Refresh"><RefreshCw className="size-4 text-muted-foreground" /></button>
          </form>

          {loadingList ? (
            <div className="space-y-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-[16px]" />)}</div>
          ) : threads.length === 0 ? (
            <p className="rounded-[20px] border border-dashed border-line2 p-10 text-center text-sm text-muted-foreground">No messages.</p>
          ) : (
            <ul className="space-y-1.5">
              {threads.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => openThread(t)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-[16px] p-3 text-left transition-colors",
                      active?.id === t.id ? "bg-card shadow-card" : "hover:bg-card/60"
                    )}
                  >
                    <Avatar className="size-9 shrink-0"><AvatarFallback className="bg-chip text-xs font-semibold">{initials(t.sender.name)}</AvatarFallback></Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn("truncate text-sm", t.unread ? "font-bold text-foreground" : "font-semibold text-foreground")}>{t.sender.name}</p>
                        <span className="shrink-0 text-[11px] text-muted-foreground">{when(t.date)}</span>
                      </div>
                      <p className="truncate text-sm text-foreground">{t.subject}</p>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <p className="truncate text-xs text-muted-foreground">{t.preview}</p>
                        {t.triage && <Chip kind={triageKind[t.triage] ?? "fyi"} />}
                      </div>
                    </div>
                    {t.unread && <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Reading pane */}
        <div className={cn(!active && "hidden lg:block")}>
          {!active ? (
            <div className="flex h-full min-h-[300px] items-center justify-center rounded-[20px] bg-card/40 text-sm text-muted-foreground">
              Select a message to read.
            </div>
          ) : (
            <div className="rounded-[20px] bg-card p-5 shadow-card lg:p-6">
              <button onClick={() => setActive(null)} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground lg:hidden"><ArrowLeft className="size-4" /> Back</button>
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <h2 className="text-2xl font-normal text-foreground" style={{ fontFamily: "var(--font-dm-serif)" }}>{active.subject}</h2>
                <div className="flex items-center gap-1">
                  {messages[0] && <ComposeDialog init={replyInit(messages[0])} trigger={<Button variant="outline" size="sm"><Reply className="size-4" /> Reply</Button>} onSent={() => {}} />}
                  {messages[0] && <ComposeDialog init={replyInit(messages[0], true)} trigger={<Button variant="outline" size="sm"><Forward className="size-4" /></Button>} onSent={() => {}} />}
                  <button onClick={() => action(() => mail.done(ids), "Marked done.")} aria-label="Done" className="rounded-lg p-2 hover:bg-accent"><Check className="size-4" /></button>
                  <button onClick={() => action(() => mail.markRead(ids, false), "Marked unread.")} aria-label="Unread" className="rounded-lg p-2 hover:bg-accent"><MailOpen className="size-4" /></button>
                  {isTrash ? (
                    <button onClick={() => { if (confirm("Permanently delete this message?")) action(() => mail.remove(ids), "Deleted."); }} aria-label="Delete permanently" className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Trash2 className="size-4" /></button>
                  ) : (
                    <button onClick={() => action(() => mail.move(ids, trashFolder?.id ?? "trash"), "Moved to Trash.")} aria-label="Trash" className="rounded-lg p-2 hover:bg-accent"><Trash2 className="size-4" /></button>
                  )}
                </div>
              </div>

              {loadingThread ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="space-y-6">
                  {messages.map((m) => (
                    <article key={m.id} className="border-t border-line pt-4 first:border-0 first:pt-0">
                      <div className="mb-3 flex items-center gap-3">
                        <Avatar className="size-9"><AvatarFallback className="bg-chip text-xs font-semibold">{initials(m.from.name)}</AvatarFallback></Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground">{m.from.name} <span className="font-normal text-muted-foreground">&lt;{m.from.email}&gt;</span></p>
                          <p className="text-xs text-muted-foreground">to {m.to.map((c) => c.name || c.email).join(", ")} · {format(new Date(m.date), "d MMM yyyy, HH:mm")}</p>
                        </div>
                      </div>
                      <div className="prose-email text-sm leading-relaxed text-foreground [&_a]:text-primary [&_a]:underline" dangerouslySetInnerHTML={{ __html: m.bodyHtml }} />
                      {m.quotedHtml && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-xs text-muted-foreground">Show quoted text</summary>
                          <div className="mt-2 border-l-2 border-line2 pl-3 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: m.quotedHtml }} />
                        </details>
                      )}
                      {m.attachments.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {m.attachments.map((att) => (
                            <span key={att.id} className="inline-flex items-center gap-1.5 rounded-full bg-chip px-3 py-1 text-xs">
                              <Paperclip className="size-3" /> {att.filename}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
