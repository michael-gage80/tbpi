"use client";

async function send(path: string, method: string, body?: unknown): Promise<{ id?: string }> {
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed.");
  return data;
}

export const tasksApi = {
  create: (b: Record<string, unknown>) => send("/api/shared/tasks", "POST", b),
  update: (b: Record<string, unknown>) => send("/api/shared/tasks", "PATCH", b),
  remove: (id: string) => send("/api/shared/tasks", "DELETE", { id }),
};

export const eventsApi = {
  create: (b: Record<string, unknown>) => send("/api/shared/events", "POST", b),
  update: (b: Record<string, unknown>) => send("/api/shared/events", "PATCH", b),
  remove: (id: string) => send("/api/shared/events", "DELETE", { id }),
};

export const announcementsApi = {
  create: (b: Record<string, unknown>) => send("/api/announcements", "POST", b),
  remove: (id: string) => send("/api/announcements", "DELETE", { id }),
};

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}
