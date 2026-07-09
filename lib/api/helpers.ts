import "server-only";

import { NextResponse } from "next/server";
import { AuthError } from "@/lib/auth/session";

/** Turn a thrown AuthError (or anything else) into a JSON response. */
export function errorResponse(err: unknown): NextResponse {
  if (err instanceof AuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  const message = err instanceof Error ? err.message : "Unexpected error.";
  return NextResponse.json({ error: message }, { status: 400 });
}

/** Millis (from the client) → Firestore Timestamp-friendly Date, or null. */
export function toDate(value: unknown): Date | null {
  if (typeof value === "number" && Number.isFinite(value)) return new Date(value);
  if (typeof value === "string") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return null;
}

export function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing or invalid "${field}".`);
  }
  return value.trim();
}
