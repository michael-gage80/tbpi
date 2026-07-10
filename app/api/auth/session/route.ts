import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE } from "@/lib/auth/session";

export const runtime = "nodejs";

const ORG_DOMAIN = "@theblackpolicyinstitute.org";
const EXPIRES_IN_MS = 24 * 60 * 60 * 1000; // 24h

export async function POST(req: NextRequest) {
  let idToken: string | undefined;
  try {
    ({ idToken } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!idToken) {
    return NextResponse.json({ error: "Missing idToken." }, { status: 400 });
  }

  try {
    // Verify the fresh ID token (checking revocation), then enforce org domain
    // and a provisioned staff/admin role before minting the session cookie.
    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(idToken, true);
    const email = decoded.email ?? "";
    const role = decoded.role;

    if (!email.endsWith(ORG_DOMAIN)) {
      return NextResponse.json({ error: "Unauthorised domain." }, { status: 403 });
    }
    if (role !== "admin" && role !== "staff") {
      return NextResponse.json(
        { error: "Account is not provisioned for the dashboard." },
        { status: 403 }
      );
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: EXPIRES_IN_MS,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: EXPIRES_IN_MS / 1000,
    });

    return NextResponse.json({ ok: true, role });
  } catch {
    return NextResponse.json({ error: "Authentication failed." }, { status: 401 });
  }
}
