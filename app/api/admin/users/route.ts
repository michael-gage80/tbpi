import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/session";
import { errorResponse, requireString } from "@/lib/api/helpers";

export const runtime = "nodejs";

const ORG_DOMAIN = "@theblackpolicyinstitute.org";

function randomPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const bytes = new Uint32Array(18);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

async function syncAllowlist(email: string, role: "admin" | "staff" | null) {
  const ref = getAdminDb().doc("config/allowlist");
  const update: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };
  if (role === "admin") {
    update.admins = FieldValue.arrayUnion(email);
    update.staff = FieldValue.arrayRemove(email);
  } else if (role === "staff") {
    update.staff = FieldValue.arrayUnion(email);
    update.admins = FieldValue.arrayRemove(email);
  } else {
    update.admins = FieldValue.arrayRemove(email);
    update.staff = FieldValue.arrayRemove(email);
  }
  await ref.set(update, { merge: true });
}

/** List all provisioned users. */
export async function GET() {
  try {
    await requireAdmin();
    const { users } = await getAdminAuth().listUsers(1000);
    const rows = users
      .filter((u) => (u.email ?? "").endsWith(ORG_DOMAIN))
      .map((u) => ({
        uid: u.uid,
        email: u.email ?? "",
        name: u.displayName ?? null,
        role: (u.customClaims?.role as string | undefined) ?? null,
        lastSignIn: u.metadata.lastSignInTime ?? null,
        created: u.metadata.creationTime ?? null,
        disabled: u.disabled,
      }))
      .sort((a, b) => a.email.localeCompare(b.email));
    return NextResponse.json({ users: rows });
  } catch (err) {
    return errorResponse(err);
  }
}

/**
 * Provision a user: name, email, role, and an admin-set password (or a
 * generated temp password when left blank). Creating a new account also seeds
 * the shared staffProfiles doc so the name shows across the app. If the email
 * already exists, updates their name/password (when given) and assigns the role.
 */
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const email = requireString(body.email, "email").toLowerCase();
    const role = body.role === "admin" ? "admin" : "staff";
    const displayName = typeof body.displayName === "string" ? body.displayName.trim() : "";
    const rawPassword = typeof body.password === "string" ? body.password : "";
    if (!email.endsWith(ORG_DOMAIN)) throw new Error(`Email must end with ${ORG_DOMAIN}.`);
    if (rawPassword && rawPassword.length < 8) throw new Error("Password must be at least 8 characters.");

    const auth = getAdminAuth();
    let uid: string;
    let tempPassword: string | null = null;
    let created = false;
    try {
      const existing = await auth.getUserByEmail(email);
      uid = existing.uid;
      const update: { password?: string; displayName?: string } = {};
      if (rawPassword) update.password = rawPassword;
      if (displayName) update.displayName = displayName;
      if (Object.keys(update).length) await auth.updateUser(uid, update);
    } catch {
      const password = rawPassword || randomPassword();
      tempPassword = rawPassword ? null : password; // only surface a password we generated
      const newUser = await auth.createUser({
        email,
        password,
        emailVerified: false,
        displayName: displayName || undefined,
      });
      uid = newUser.uid;
      created = true;
    }
    await auth.setCustomUserClaims(uid, { role });
    await syncAllowlist(email, role);
    if (displayName) {
      await getAdminDb().doc(`staffProfiles/${uid}`).set(
        { uid, email, displayName, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
    }
    return NextResponse.json({ uid, role, tempPassword, created });
  } catch (err) {
    return errorResponse(err);
  }
}

/** Change a user's role. */
export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const uid = requireString(body.uid, "uid");
    const role = body.role === "admin" ? "admin" : "staff";
    if (uid === session.uid && role !== "admin") throw new Error("You cannot remove your own admin role.");

    const auth = getAdminAuth();
    const user = await auth.getUser(uid);
    await auth.setCustomUserClaims(uid, { role });
    await syncAllowlist(user.email ?? "", role);
    return NextResponse.json({ uid, role });
  } catch (err) {
    return errorResponse(err);
  }
}

/** Revoke access: clear role + revoke sessions + remove from allowlist. */
export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const uid = requireString(body.uid, "uid");
    if (uid === session.uid) throw new Error("You cannot revoke your own access.");

    const auth = getAdminAuth();
    const user = await auth.getUser(uid);
    await auth.setCustomUserClaims(uid, { role: null });
    await auth.revokeRefreshTokens(uid);
    await syncAllowlist(user.email ?? "", null);
    return NextResponse.json({ uid });
  } catch (err) {
    return errorResponse(err);
  }
}
