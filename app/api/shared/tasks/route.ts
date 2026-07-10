import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireStaff } from "@/lib/auth/session";
import { errorResponse, toDate, requireString } from "@/lib/api/helpers";

export const runtime = "nodejs";

const COLLECTION = "sharedTasks";

export async function POST(req: NextRequest) {
  try {
    const session = await requireStaff();
    const body = await req.json();
    const title = requireString(body.title, "title");

    const doc = {
      title,
      notes: typeof body.notes === "string" ? body.notes : "",
      done: false,
      assigneeEmail: typeof body.assigneeEmail === "string" ? body.assigneeEmail : null,
      assigneeName: typeof body.assigneeName === "string" ? body.assigneeName : null,
      priority: ["high", "medium", "low"].includes(body.priority) ? body.priority : null,
      project: typeof body.project === "string" ? body.project : null,
      dueAt: toDate(body.dueAt),
      createdBy: session.uid,
      createdByEmail: session.email,
      createdAt: FieldValue.serverTimestamp(),
    };

    const ref = await getAdminDb().collection(COLLECTION).add(doc);
    return NextResponse.json({ id: ref.id });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireStaff();
    const body = await req.json();
    const id = requireString(body.id, "id");

    const update: Record<string, unknown> = {};
    if (typeof body.title === "string") update.title = body.title.trim();
    if (typeof body.notes === "string") update.notes = body.notes;
    if (typeof body.assigneeEmail === "string" || body.assigneeEmail === null)
      update.assigneeEmail = body.assigneeEmail;
    if (typeof body.assigneeName === "string" || body.assigneeName === null)
      update.assigneeName = body.assigneeName;
    if (["high", "medium", "low"].includes(body.priority)) update.priority = body.priority;
    if (typeof body.project === "string" || body.project === null) update.project = body.project;
    if ("dueAt" in body) update.dueAt = toDate(body.dueAt);

    if (typeof body.done === "boolean") {
      update.done = body.done;
      if (body.done) {
        update.completedBy = session.uid;
        update.completedAt = FieldValue.serverTimestamp();
      } else {
        update.completedBy = null;
        update.completedAt = null;
      }
    }

    await getAdminDb().collection(COLLECTION).doc(id).update(update);
    return NextResponse.json({ id });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireStaff();
    const body = await req.json();
    const id = requireString(body.id, "id");
    await getAdminDb().collection(COLLECTION).doc(id).delete();
    return NextResponse.json({ id });
  } catch (err) {
    return errorResponse(err);
  }
}
