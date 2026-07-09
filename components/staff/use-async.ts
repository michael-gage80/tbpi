"use client";

import { useEffect, useState } from "react";
import { useFirebaseUser } from "@/components/staff/use-auth";

type AsyncState<T> = { data: T | null; loading: boolean; error: string | null };

/**
 * Runs an async loader once the Firebase client session is ready (callables
 * require the signed-in user's ID token). Returns loading/empty/error state.
 */
export function useAsync<T>(loader: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const { user, ready } = useFirebaseUser();
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      setState({ data: null, loading: false, error: "Not signed in." });
      return;
    }
    let active = true;
    setState({ data: null, loading: true, error: null });
    loader()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((err) =>
        active &&
        setState({ data: null, loading: false, error: err?.message || "Failed to load." })
      );
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, ready, ...deps]);

  return state;
}
