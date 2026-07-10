"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useFirebaseUser } from "@/components/staff/use-auth";
import type { SharedTask, SharedEvent, SharedAnnouncement } from "@/lib/firebase/types";

const millis = (v: unknown): number | null =>
  v instanceof Timestamp ? v.toMillis() : typeof v === "number" ? v : null;

type Snapshot<T> = { data: T[]; loading: boolean; error: string | null };

function useCollection<T>(
  path: string,
  orderField: string,
  direction: "asc" | "desc",
  map: (id: string, d: DocumentData) => T
): Snapshot<T> {
  const { user, ready } = useFirebaseUser();
  const [state, setState] = useState<Snapshot<T>>({ data: [], loading: true, error: null });

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ data: [], loading: false, error: null });
      return;
    }
    const q = query(collection(db, path), orderBy(orderField, direction));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setState({
          data: snap.docs.map((doc) => map(doc.id, doc.data())),
          loading: false,
          error: null,
        });
      },
      (err) => setState({ data: [], loading: false, error: err.message })
    );
    return unsub;
  }, [path, orderField, direction, map, user, ready]);

  return state;
}

const mapTask = (id: string, d: DocumentData): SharedTask => ({
  id,
  title: d.title ?? "",
  notes: d.notes ?? undefined,
  done: !!d.done,
  assigneeEmail: d.assigneeEmail ?? undefined,
  assigneeName: d.assigneeName ?? undefined,
  priority: d.priority ?? undefined,
  project: d.project ?? undefined,
  createdBy: d.createdBy ?? "",
  createdByEmail: d.createdByEmail ?? "",
  createdAt: millis(d.createdAt),
  dueAt: millis(d.dueAt),
  completedBy: d.completedBy ?? undefined,
  completedAt: millis(d.completedAt),
});

const mapEvent = (id: string, d: DocumentData): SharedEvent => ({
  id,
  title: d.title ?? "",
  start: millis(d.start) ?? 0,
  end: millis(d.end) ?? millis(d.start) ?? 0,
  allDay: !!d.allDay,
  category: d.category ?? "event",
  location: d.location ?? undefined,
  notes: d.notes ?? undefined,
  createdBy: d.createdBy ?? "",
  createdByEmail: d.createdByEmail ?? "",
  createdAt: millis(d.createdAt),
});

const mapAnnouncement = (id: string, d: DocumentData): SharedAnnouncement => ({
  id,
  title: d.title ?? "",
  body: d.body ?? "",
  pinned: !!d.pinned,
  createdBy: d.createdBy ?? "",
  createdByEmail: d.createdByEmail ?? "",
  createdAt: millis(d.createdAt),
});

export const useSharedTasks = () =>
  useCollection<SharedTask>("sharedTasks", "createdAt", "desc", mapTask);

export const useSharedEvents = () =>
  useCollection<SharedEvent>("sharedEvents", "start", "asc", mapEvent);

export const useSharedAnnouncements = () =>
  useCollection<SharedAnnouncement>("sharedAnnouncements", "createdAt", "desc", mapAnnouncement);
