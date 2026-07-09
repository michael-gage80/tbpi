import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE)?.value;

  if (cookie) {
    try {
      const adminAuth = getAdminAuth();
      const decoded = await adminAuth.verifySessionCookie(cookie);
      await adminAuth.revokeRefreshTokens(decoded.uid);
    } catch {
      // Cookie already invalid/expired — clearing it below is enough.
    }
  }

  cookieStore.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
