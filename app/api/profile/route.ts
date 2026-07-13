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
        pronouns: d?.pronouns ?? "",
        location: d?.location ?? "",
        startDate: d?.startDate ?? "",
        askMeAbout: Array.isArray(d?.askMeAbout) ? d!.askMeAbout : [],
        links: Array.isArray(d?.links) ? d!.links : [],
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
    if (typeof body.pronouns === "string") update.pronouns = body.pronouns.trim().slice(0, 40);
    if (typeof body.location === "string") update.location = body.location.trim().slice(0, 80);
    if (typeof body.startDate === "string") {
      // Accept an empty string (clear) or a valid YYYY-MM-DD.
      update.startDate = /^\d{4}-\d{2}-\d{2}$/.test(body.startDate) ? body.startDate : "";
    }
    if (Array.isArray(body.askMeAbout)) {
      update.askMeAbout = body.askMeAbout
        .filter((t: unknown): t is string => typeof t === "string")
        .map((t: string) => t.trim())
        .filter(Boolean)
        .slice(0, 8);
    }
    if (Array.isArray(body.links)) {
      update.links = body.links
        .filter(
          (l: unknown): l is { label: unknown; url: unknown } =>
            typeof l === "object" && l !== null
        )
        .map((l: { label: unknown; url: unknown }) => ({
          label: String(l.label ?? "").trim().slice(0, 40),
          url: String(l.url ?? "").trim().slice(0, 300),
        }))
        .filter((l: { label: string; url: string }) => l.url && /^https?:\/\//i.test(l.url))
        .slice(0, 5);
    }

    await getAdminDb().doc(`staffProfiles/${session.uid}`).set(update, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
