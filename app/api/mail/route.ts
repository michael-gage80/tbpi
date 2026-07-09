import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { callAsUser } from "@/lib/firebase/admin-callables";
import { errorResponse } from "@/lib/api/helpers";

export const runtime = "nodejs";

type Body = Record<string, unknown>;

// Dispatch table: op -> underlying requireAdmin callable. Mail never touches the
// browser except through these server routes (the admin's own mailbox).
const OPS: Record<string, (uid: string, d: Body) => Promise<unknown>> = {
  folders: (uid) => callAsUser(uid, "foldersList"),
  list: (uid, d) => callAsUser(uid, "mailList", { folderId: d.folderId, search: d.search }),
  thread: (uid, d) => callAsUser(uid, "mailGet", { refs: d.refs }),
  send: (uid, d) =>
    callAsUser(uid, "mailSend", {
      to: d.to,
      cc: d.cc,
      bcc: d.bcc,
      subject: d.subject,
      body: d.body,
      attachments: d.attachments,
    }),
  draftSave: (uid, d) =>
    callAsUser(uid, "mailDraftSave", {
      draftId: d.draftId,
      to: d.to,
      cc: d.cc,
      bcc: d.bcc,
      subject: d.subject,
      body: d.body,
      attachments: d.attachments,
    }),
  draftDelete: (uid, d) => callAsUser(uid, "mailDraftDelete", { draftId: d.draftId }),
  uploadAttachment: (uid, d) =>
    callAsUser(uid, "mailUploadAttachment", {
      fileName: d.fileName,
      contentBase64: d.contentBase64,
      contentType: d.contentType,
    }),
  getAttachment: (uid, d) =>
    callAsUser(uid, "mailAttachment", {
      messageId: d.messageId,
      folderId: d.folderId,
      attachmentId: d.attachmentId,
    }),
  move: (uid, d) => callAsUser(uid, "mailMove", { messageIds: d.messageIds, folderId: d.folderId }),
  markRead: (uid, d) => callAsUser(uid, "mailMarkRead", { messageIds: d.messageIds, read: d.read }),
  done: (uid, d) => callAsUser(uid, "mailDone", { messageIds: d.messageIds }),
  delete: (uid, d) => callAsUser(uid, "mailDelete", { messageIds: d.messageIds }),
};

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = (await req.json()) as Body & { op?: string };
    const op = body.op;
    const fn = op ? OPS[op] : undefined;
    if (!fn) throw new Error(`Unknown mail op: ${op}`);
    const result = await fn(session.uid, body);
    return NextResponse.json({ result });
  } catch (err) {
    return errorResponse(err);
  }
}
