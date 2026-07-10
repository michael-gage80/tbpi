import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/session";
import { errorResponse, requireString } from "@/lib/api/helpers";

export const runtime = "nodejs";

const COLLECTION = "sharedAnnouncements";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const title = requireString(body.title, "title");
    const text = requireString(body.body, "body");

    const doc = {
      title,
      body: text,
      pinned: body.pinned === true,
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

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const id = requireString(body.id, "id");
    await getAdminDb().collection(COLLECTION).doc(id).delete();
    return NextResponse.json({ id });
  } catch (err) {
    return errorResponse(err);
  }
}
