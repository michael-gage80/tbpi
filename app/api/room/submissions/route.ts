import { NextRequest, NextResponse } from "next/server";
import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireStaff, requireAdmin } from "@/lib/auth/session";
import { errorResponse, requireString } from "@/lib/api/helpers";
import { uploadRoomFile } from "@/lib/room/storage";
import type { ResourceCategory, RoomSubmission } from "@/lib/firebase/types";

export const runtime = "nodejs";

const SUBMISSIONS = "roomResourceSubmissions";
const RESOURCES = "roomResources";
const CATEGORIES: ResourceCategory[] = ["brand", "templates", "policies", "tools", "links"];

function coerceCategory(value: unknown): ResourceCategory {
  return CATEGORIES.includes(value as ResourceCategory) ? (value as ResourceCategory) : "links";
}

function toSubmission(id: string, d: DocumentData): RoomSubmission {
  return {
    id,
    title: d.title ?? "",
    description: d.description ?? "",
    suggestedCategory: d.suggestedCategory ?? undefined,
    kind: d.kind === "file" ? "file" : "link",
    url: d.url ?? "",
    fileName: d.fileName ?? null,
    fileSize: d.fileSize ?? null,
    mimeType: d.mimeType ?? null,
    storagePath: d.storagePath ?? null,
    status: d.status ?? "pending",
    submittedBy: d.submittedBy ?? "",
    submittedByEmail: d.submittedByEmail ?? "",
    submittedByName: d.submittedByName ?? undefined,
    createdAt: d.createdAt?.toMillis?.() ?? null,
    reviewedBy: d.reviewedBy ?? null,
    reviewedAt: d.reviewedAt?.toMillis?.() ?? null,
  };
}

// Any staff member can propose a document or link for the hub.
export async function POST(req: NextRequest) {
  try {
    const session = await requireStaff();
    const body = await req.json();
    const title = requireString(body.title, "title");
    const kind = body.kind === "file" ? "file" : "link";

    const doc: Record<string, unknown> = {
      title,
      description: typeof body.description === "string" ? body.description.trim() : "",
      suggestedCategory: coerceCategory(body.suggestedCategory),
      kind,
      status: "pending",
      submittedBy: session.uid,
      submittedByEmail: session.email,
      submittedByName: typeof body.submittedByName === "string" ? body.submittedByName.trim() : "",
      createdAt: FieldValue.serverTimestamp(),
      reviewedBy: null,
      reviewedAt: null,
    };

    if (kind === "file") {
      const uploaded = await uploadRoomFile({
        base64: body.fileBase64,
        fileName: requireString(body.fileName, "fileName"),
        contentType: typeof body.contentType === "string" ? body.contentType : "application/octet-stream",
        prefix: "roomSubmissions",
      });
      Object.assign(doc, {
        url: uploaded.url,
        storagePath: uploaded.storagePath,
        fileName: uploaded.fileName,
        fileSize: uploaded.fileSize,
        mimeType: uploaded.mimeType,
      });
    } else {
      const url = requireString(body.url, "url");
      if (!/^https?:\/\//i.test(url)) throw new Error("Link must start with http(s)://");
      doc.url = url;
    }

    const ref = await getAdminDb().collection(SUBMISSIONS).add(doc);
    return NextResponse.json({ id: ref.id });
  } catch (err) {
    return errorResponse(err);
  }
}

// Admin-only: the pending review queue.
export async function GET() {
  try {
    await requireAdmin();
    // Single-field filter only (no composite index needed); sort in memory.
    const snap = await getAdminDb()
      .collection(SUBMISSIONS)
      .where("status", "==", "pending")
      .get();
    const submissions = snap.docs
      .map((doc) => toSubmission(doc.id, doc.data()))
      .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    return NextResponse.json({ submissions });
  } catch (err) {
    return errorResponse(err);
  }
}

// Admin-only: approve (publishes to the hub) or reject a submission.
export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const id = requireString(body.id, "id");
    const action = body.action === "approve" ? "approve" : body.action === "reject" ? "reject" : null;
    if (!action) throw new Error('action must be "approve" or "reject".');

    const db = getAdminDb();
    const ref = db.collection(SUBMISSIONS).doc(id);
    const snap = await ref.get();
    if (!snap.exists) throw new Error("Submission not found.");
    const s = snap.data() as DocumentData;

    if (action === "approve") {
      // Copy into the curated hub. The stored file (if any) is reused in place.
      await db.collection(RESOURCES).add({
        title: s.title ?? "",
        description: s.description ?? "",
        category: coerceCategory(body.category ?? s.suggestedCategory),
        kind: s.kind === "file" ? "file" : "link",
        url: s.url ?? "",
        fileName: s.fileName ?? null,
        fileSize: s.fileSize ?? null,
        mimeType: s.mimeType ?? null,
        storagePath: s.storagePath ?? null,
        createdBy: session.uid,
        createdByEmail: session.email,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    await ref.update({
      status: action === "approve" ? "approved" : "rejected",
      reviewedBy: session.email,
      reviewedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id, status: action === "approve" ? "approved" : "rejected" });
  } catch (err) {
    return errorResponse(err);
  }
}
