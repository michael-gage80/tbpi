import "server-only";

import {
  getApps,
  initializeApp,
  cert,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

// Lazy singletons — initialised on first use, never at module load, so a
// missing/placeholder FIREBASE_SERVICE_ACCOUNT can't crash `next build`.
let appInstance: App | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

function getAdminApp(): App {
  if (appInstance) return appInstance;
  const existing = getApps();
  if (existing.length) {
    appInstance = existing[0];
    return appInstance;
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT is not set. Add the service-account JSON to the environment."
    );
  }

  let serviceAccount: ServiceAccount;
  try {
    serviceAccount = JSON.parse(raw);
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is not valid JSON.");
  }

  appInstance = initializeApp({ credential: cert(serviceAccount) });
  return appInstance;
}

export function getAdminAuth(): Auth {
  return (authInstance ??= getAuth(getAdminApp()));
}

export function getAdminDb(): Firestore {
  return (dbInstance ??= getFirestore(getAdminApp()));
}
