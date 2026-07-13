import "server-only";

import { randomUUID } from "node:crypto";
import { getAdminBucket } from "@/lib/firebase/admin";

// Uploads go through this Admin-SDK server route, so the Vercel ~4.5MB request
// body limit applies. base64 inflates ~33%, so we cap the decoded file at 3MB
// (a base64 body of ~4MB, safely under the limit). Larger files would need a
// client-direct-to-Storage upload — a future enhancement.
export const MAX_ROOM_FILE_BYTES = 3_000_000;

export interface UploadedFile {
  url: string;
  storagePath: string;
  fileSize: number;
  mimeType: string;
  fileName: string;
}

/**
 * Persist a base64-encoded file to Firebase Storage under the given prefix and
 * return a tokenised public download URL plus metadata. Throws if the bucket
 * isn't provisioned or the file exceeds the size cap.
 */
export async function uploadRoomFile(opts: {
  base64: string;
  fileName: string;
  contentType: string;
  prefix: string;
}): Promise<UploadedFile> {
  const { base64, fileName, contentType, prefix } = opts;
  if (typeof base64 !== "string" || !base64) throw new Error("Missing file.");

  const buffer = Buffer.from(base64, "base64");
  if (buffer.length === 0) throw new Error("Empty file.");
  if (buffer.length > MAX_ROOM_FILE_BYTES) {
    throw new Error("File too large (max 3MB for now).");
  }

  const bucket = getAdminBucket();
  const [bucketExists] = await bucket.exists().catch(() => [false]);
  if (!bucketExists) {
    throw new Error("File storage is not enabled for this project.");
  }

  // Keep the original extension for a sensible download filename.
  const safeName = fileName.replace(/[^\w.\-]+/g, "_").slice(0, 120) || "file";
  const storagePath = `${prefix}/${randomUUID()}-${safeName}`;
  const token = randomUUID();

  await bucket.file(storagePath).save(buffer, {
    resumable: false,
    contentType,
    metadata: {
      contentType,
      contentDisposition: `attachment; filename="${safeName}"`,
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });

  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
    storagePath
  )}?alt=media&token=${token}`;

  return { url, storagePath, fileSize: buffer.length, mimeType: contentType, fileName: safeName };
}

/** Best-effort delete of a stored object (ignores missing files). */
export async function deleteRoomFile(storagePath?: string | null): Promise<void> {
  if (!storagePath) return;
  try {
    await getAdminBucket().file(storagePath).delete({ ignoreNotFound: true });
  } catch {
    // Non-fatal — the Firestore doc removal is the source of truth.
  }
}
