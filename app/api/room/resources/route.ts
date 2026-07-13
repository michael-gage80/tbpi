import { NextRequest, NextResponse } from "next/server";
import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireStaff, requireAdmin } from "@/lib/auth/session";
import { errorResponse, requireString } from "@/lib/api/helpers";
import { uploadRoomFile, deleteRoomFile } from "@/lib/room/storage";
import type { ResourceCategory, RoomResource } from "@/lib/firebase/types";

export const runtime = "nodejs";

const COLLECTION = "roomResources";
const CATEGORIES: ResourceCategory[] = ["brand", "templates", "policies", "tools", "links"];

function coerceCategory(value: unknown): ResourceCategory {
  return CATEGORIES.includes(value as ResourceCategory) ? (value as ResourceCategory) : "links";
}

function toResource(id: string, d: DocumentData): RoomResource {
  return {
    id,
    title: d.title ?? "",
    description: d.description ?? "",
    category: coerceCategory(d.category),
    kind: d.kind === "file" ? "file" : "link",
    url: d.url ?? "",
    fileName: d.fileName ?? null,
    fileSize: d.fileSize ?? null,
    mimeType: d.mimeType ?? null,
    storagePath: d.storagePath ?? null,
    createdBy: d.createdBy ?? "",
    createdByEmail: d.createdByEmail ?? "",
    createdAt: d.createdAt?.toMillis?.() ?? null,
  };
}

// Any signed-in staff member can read the curated hub.
export async function GET() {
  try {
    await requireStaff();
    const snap = await getAdminDb().collection(COLLECTION).orderBy("createdAt", "desc").get();
    const resources = snap.docs.map((doc) => toResource(doc.id, doc.data()));
    return NextResponse.json({ resources });
  } catch (err) {
    return errorResponse(err);
  }
}

// Admin-only: add a resource (file upload or external link).
export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const title = requireString(body.title, "title");
    const category = coerceCategory(body.category);
    const kind = body.kind === "file" ? "file" : "link";

    const doc: Record<string, unknown> = {
      title,
      description: typeof body.description === "string" ? body.description.trim() : "",
      category,
      kind,
      createdBy: session.uid,
      createdByEmail: session.email,
      createdAt: FieldValue.serverTimestamp(),
    };

    if (kind === "file") {
      const uploaded = await uploadRoomFile({
        base64: body.fileBase64,
        fileName: requireString(body.fileName, "fileName"),
        contentType: typeof body.contentType === "string" ? body.contentType : "application/octet-stream",
        prefix: "roomResources",
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

    const ref = await getAdminDb().collection(COLLECTION).add(doc);
    return NextResponse.json({ id: ref.id });
  } catch (err) {
    return errorResponse(err);
  }
}

// Admin-only: edit resource metadata (title, description, category).
export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const id = requireString(body.id, "id");
    const update: Record<string, unknown> = {};
    if (typeof body.title === "string") update.title = body.title.trim();
    if (typeof body.description === "string") update.description = body.description.trim();
    if (body.category !== undefined) update.category = coerceCategory(body.category);
    if (Object.keys(update).length === 0) throw new Error("Nothing to update.");
    await getAdminDb().collection(COLLECTION).doc(id).update(update);
    return NextResponse.json({ id });
  } catch (err) {
    return errorResponse(err);
  }
}

// Admin-only: delete a resource (and its stored file, if any).
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const id = requireString(body.id, "id");
    const ref = getAdminDb().collection(COLLECTION).doc(id);
    const snap = await ref.get();
    if (snap.exists) {
      await deleteRoomFile(snap.data()?.storagePath);
      await ref.delete();
    }
    return NextResponse.json({ id });
  } catch (err) {
    return errorResponse(err);
  }
}
