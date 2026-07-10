"use client";

import { useEffect, useState, useCallback } from "react";
import type { StaffProfile } from "@/lib/firebase/types";

export type RosterProfile = Pick<StaffProfile, "uid" | "email" | "displayName" | "title" | "photoURL">;

let rosterCache: RosterProfile[] | null = null;
let rosterPromise: Promise<RosterProfile[]> | null = null;
const subscribers = new Set<(r: RosterProfile[]) => void>();

async function fetchRoster(): Promise<RosterProfile[]> {
  const res = await fetch("/api/profiles");
  if (!res.ok) throw new Error("roster");
  const data = await res.json();
  rosterCache = data.profiles as RosterProfile[];
  subscribers.forEach((s) => s(rosterCache!));
  return rosterCache;
}

export function loadRoster(): Promise<RosterProfile[]> {
  rosterPromise ??= fetchRoster();
  return rosterPromise;
}

/** Refresh the shared roster (after editing your own profile). */
export function refreshRoster(): Promise<RosterProfile[]> {
  rosterPromise = fetchRoster();
  return rosterPromise;
}

export function useProfiles(): RosterProfile[] {
  const [roster, setRoster] = useState<RosterProfile[]>(rosterCache ?? []);
  useEffect(() => {
    subscribers.add(setRoster);
    loadRoster().then(setRoster).catch(() => setRoster([]));
    return () => {
      subscribers.delete(setRoster);
    };
  }, []);
  return roster;
}

export function useProfileByEmail(email?: string | null): RosterProfile | undefined {
  const roster = useProfiles();
  if (!email) return undefined;
  const e = email.toLowerCase();
  return roster.find((p) => p.email.toLowerCase() === e);
}

/** The signed-in user's editable profile. */
export function useMyProfile() {
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setProfile(data.profile ?? null);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { profile, loading, refresh };
}
