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
      };
    });
    return NextResponse.json({ profiles });
  } catch (err) {
    return errorResponse(err);
  }
}
