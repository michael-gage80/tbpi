import "server-only";

import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase/admin";
import type { Role, Session } from "@/lib/firebase/types";

export const SESSION_COOKIE = "__session";

function coerceRole(claim: unknown): Role | null {
  return claim === "admin" || claim === "staff" ? claim : null;
}

/**
 * Authoritative auth check for server components and route handlers.
 * Verifies the httpOnly __session cookie with the Admin SDK (checking
 * revocation) and returns the identity, or null if unauthenticated.
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE)?.value;
  if (!cookie) return null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(cookie, true);
    const role = coerceRole(decoded.role);
    const email = decoded.email;
    if (!role || !email) return null;
    return { uid: decoded.uid, email, role };
  } catch {
    return null;
  }
}

/** For route handlers: returns the session or throws a 401/403-shaped error. */
export class AuthError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function requireStaff(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new AuthError(401, "Not authenticated.");
  // staff = role is "staff" or "admin"
  return session;
}

export async function requireAdmin(): Promise<Session> {
  const session = await requireStaff();
  if (session.role !== "admin") throw new AuthError(403, "Admin only.");
  return session;
}
