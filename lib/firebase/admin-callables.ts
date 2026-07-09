import "server-only";

import { getAdminAuth } from "@/lib/firebase/admin";

// Calls a us-central1 onCall function AS the signed-in user, from the server.
// The mail callables enforce requireAdmin against the user's token, and there is
// no service-account path into them — so we mint a short-lived ID token for the
// user (custom token -> Identity Toolkit exchange) and call the HTTPS endpoint
// with it. ID tokens are cached per-uid to avoid re-minting on every request.

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const REGION = "us-central1";

const tokenCache = new Map<string, { token: string; expiresAt: number }>();

async function idTokenForUser(uid: string): Promise<string> {
  const cached = tokenCache.get(uid);
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;

  if (!API_KEY) throw new Error("NEXT_PUBLIC_FIREBASE_API_KEY is not set.");
  const customToken = await getAdminAuth().createCustomToken(uid);
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: customToken, returnSecureToken: true }),
    }
  );
  const data = await res.json();
  if (!data.idToken) throw new Error("Failed to mint ID token for callable.");
  tokenCache.set(uid, { token: data.idToken, expiresAt: Date.now() + 50 * 60_000 });
  return data.idToken;
}

export async function callAsUser<T>(uid: string, name: string, data: unknown = {}): Promise<T> {
  if (!PROJECT_ID) throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set.");
  const idToken = await idTokenForUser(uid);
  const res = await fetch(`https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ data }),
  });
  const json = await res.json();
  if (json.error) {
    throw new Error(json.error.message || `Callable ${name} failed.`);
  }
  return json.result as T;
}
