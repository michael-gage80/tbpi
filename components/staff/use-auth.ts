"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

/**
 * Tracks the client-side Firebase Auth session (kept alive purely to power
 * realtime reads / callables). `ready` flips true once the initial auth state
 * has resolved, so listeners don't subscribe before the user is known.
 */
export function useFirebaseUser(): { user: User | null; ready: boolean } {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
  }, []);

  return { user, ready };
}
