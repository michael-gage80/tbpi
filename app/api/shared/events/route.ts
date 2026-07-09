import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireStaff } from "@/lib/auth/session";
import { errorResponse, toDate, requireString } from "@/lib/api/helpers";

export const runtime = "nodejs";

const COLLECTION = "sharedEvents";
const CATEGORIES = ["event", "meeting", "deadline"];

export async function POST(req: NextRequest) {
  try {
    const session = await requireStaff();
    const body = await req.json();
    const title = requireString(body.title, "title");
    const start = toDate(body.start);
    const end = toDate(body.end) ?? start;
    if (!start) throw new Error('Missing or invalid "start".');

    const doc = {
      title,
      start,
      end,
      allDay: body.allDay === true,
      category: CATEGORIES.includes(body.category) ? body.category : "event",
      location: typeof body.location === "string" ? body.location : null,
      notes: typeof body.notes === "string" ? body.notes : null,
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
    await requireStaff();
    const body = await req.json();
    const id = requireString(body.id, "id");

    const update: Record<string, unknown> = {};
    if (typeof body.title === "string") update.title = body.title.trim();
    if ("start" in body) update.start = toDate(body.start);
    if ("end" in body) update.end = toDate(body.end);
    if (typeof body.allDay === "boolean") update.allDay = body.allDay;
    if (CATEGORIES.includes(body.category)) update.category = body.category;
    if (typeof body.location === "string" || body.location === null)
      update.location = body.location;
    if (typeof body.notes === "string" || body.notes === null) update.notes = body.notes;

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
