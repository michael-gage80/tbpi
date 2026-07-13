import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireStaff } from "@/lib/auth/session";
import { errorResponse } from "@/lib/api/helpers";

export const runtime = "nodejs";

// Org-wide roster (read via server, respecting the staff gate). Used for avatar
// resolution and the task-assignee people-picker.
export async function GET() {
  try {
    await requireStaff();
    const snap = await getAdminDb().collection("staffProfiles").get();
    const profiles = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        uid: doc.id,
        email: d.email ?? "",
        displayName: d.displayName ?? "",
        title: d.title ?? "",
        photoURL: d.photoURL ?? null,
        // Directory fields (optional; consumers that only need the roster ignore these).
        bio: d.bio ?? "",
        pronouns: d.pronouns ?? "",
        location: d.location ?? "",
        startDate: d.startDate ?? "",
        askMeAbout: Array.isArray(d.askMeAbout) ? d.askMeAbout : [],
        links: Array.isArray(d.links) ? d.links : [],
      };
    });
    return NextResponse.json({ profiles });
  } catch (err) {
    return errorResponse(err);
  }
}
