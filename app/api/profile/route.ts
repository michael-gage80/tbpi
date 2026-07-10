import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireStaff } from "@/lib/auth/session";
import { errorResponse } from "@/lib/api/helpers";

export const runtime = "nodejs";

function defaultName(email: string): string {
  const local = email.split("@")[0].replace(/[._-]+/g, " ");
  return local.replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function GET() {
  try {
    const session = await requireStaff();
    const snap = await getAdminDb().doc(`staffProfiles/${session.uid}`).get();
    const d = snap.exists ? snap.data() : null;
    return NextResponse.json({
      profile: {
        uid: session.uid,
        email: session.email,
        displayName: d?.displayName ?? defaultName(session.email),
        title: d?.title ?? "",
        bio: d?.bio ?? "",
        photoURL: d?.photoURL ?? null,
      },
    });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireStaff();
    const body = await req.json();
    const update: Record<string, unknown> = {
      email: session.email,
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (typeof body.displayName === "string") update.displayName = body.displayName.trim().slice(0, 80);
    if (typeof body.title === "string") update.title = body.title.trim().slice(0, 80);
    if (typeof body.bio === "string") update.bio = body.bio.trim().slice(0, 500);

    await getAdminDb().doc(`staffProfiles/${session.uid}`).set(update, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
