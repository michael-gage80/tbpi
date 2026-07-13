"use client";

import type {
  RoomResource,
  RoomSubmission,
  ResourceCategory,
  ResourceKind,
} from "@/lib/firebase/types";

async function jsonOrThrow(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed.");
  return data;
}

/** Read a File as a base64 string (no data-URL prefix). */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

export interface ResourceInput {
  title: string;
  description?: string;
  category: ResourceCategory;
  kind: ResourceKind;
  url?: string;
  fileBase64?: string;
  fileName?: string;
  contentType?: string;
}

export const resourcesApi = {
  async list(): Promise<RoomResource[]> {
    const data = await jsonOrThrow(await fetch("/api/room/resources"));
    return data.resources as RoomResource[];
  },
  async create(input: ResourceInput): Promise<void> {
    await jsonOrThrow(
      await fetch("/api/room/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
    );
  },
  async update(input: { id: string; title?: string; description?: string; category?: ResourceCategory }): Promise<void> {
    await jsonOrThrow(
      await fetch("/api/room/resources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
    );
  },
  async remove(id: string): Promise<void> {
    await jsonOrThrow(
      await fetch("/api/room/resources", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
    );
  },
};

export interface SubmissionInput {
  title: string;
  description?: string;
  suggestedCategory: ResourceCategory;
  kind: ResourceKind;
  url?: string;
  fileBase64?: string;
  fileName?: string;
  contentType?: string;
  submittedByName?: string;
}

export const submissionsApi = {
  async submit(input: SubmissionInput): Promise<void> {
    await jsonOrThrow(
      await fetch("/api/room/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
    );
  },
  async list(): Promise<RoomSubmission[]> {
    const data = await jsonOrThrow(await fetch("/api/room/submissions"));
    return data.submissions as RoomSubmission[];
  },
  async review(input: { id: string; action: "approve" | "reject"; category?: ResourceCategory }): Promise<void> {
    await jsonOrThrow(
      await fetch("/api/room/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
    );
  },
};

/* Shared category metadata for labels/ordering across the UI. */
export const CATEGORY_META: Record<ResourceCategory, { label: string }> = {
  brand: { label: "Brand" },
  templates: { label: "Templates" },
  policies: { label: "Handbook & Policies" },
  tools: { label: "Tools" },
  links: { label: "Links" },
};

export const CATEGORY_ORDER: ResourceCategory[] = ["brand", "templates", "policies", "tools", "links"];

/** Client-side mirror of the server cap (kept in sync with lib/room/storage.ts). */
export const MAX_FILE_BYTES = 3_000_000;

export function formatFileSize(bytes?: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
