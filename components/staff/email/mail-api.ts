"use client";

import type { MailFolder, EmailThread, EmailMessage } from "@/lib/firebase/types";

/** Error message thrown by mail ops when the admin hasn't connected Zoho yet. */
export const ZOHO_NOT_CONNECTED = "zoho-not-connected";

async function op<T>(op: string, args: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch("/api/mail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ op, ...args }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Mail request failed.");
  return data.result as T;
}

export interface ZohoConnection {
  connected: boolean;
  email?: string | null;
  connectedAt?: string | null;
}

export interface SendPayload {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  attachments?: unknown[];
}

export const mail = {
  folders: () => op<MailFolder[]>("folders"),
  list: (folderId: string, search?: string) => op<EmailThread[]>("list", { folderId, search }),
  thread: (refs: { id: string; folderId: string }[]) => op<EmailMessage[]>("thread", { refs }),
  send: (payload: SendPayload) => op<{ ok: boolean }>("send", { ...payload }),
  move: (messageIds: string[], folderId: string) => op("move", { messageIds, folderId }),
  markRead: (messageIds: string[], read: boolean) => op("markRead", { messageIds, read }),
  done: (messageIds: string[]) => op("done", { messageIds }),
  remove: (messageIds: string[]) => op("delete", { messageIds }),
  uploadAttachment: (fileName: string, contentBase64: string, contentType: string) =>
    op<unknown>("uploadAttachment", { fileName, contentBase64, contentType }),
  // Per-user Zoho OAuth.
  connectionStatus: () => op<ZohoConnection>("connectionStatus"),
  connectStart: () => op<{ url: string }>("authStart"),
  disconnect: () => op<{ ok: boolean }>("disconnect"),
};
