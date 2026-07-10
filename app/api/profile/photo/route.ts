import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, getAdminBucket } from "@/lib/firebase/admin";
import { requireStaff } from "@/lib/auth/session";
import { errorResponse } from "@/lib/api/helpers";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await requireStaff();
    const { imageBase64, contentType = "image/jpeg" } = await req.json();
    if (typeof imageBase64 !== "string" || !imageBase64) throw new Error("Missing image.");

    const buffer = Buffer.from(imageBase64, "base64");
    if (buffer.length > 3_000_000) throw new Error("Image too large (max 3MB).");

    let photoURL: string;

    // Prefer Firebase Storage; if the bucket isn't provisioned for the project,
    // fall back to an inline data URL (the cropped avatar is small, ~20–40KB).
    const bucket = getAdminBucket();
    const [bucketExists] = await bucket.exists().catch(() => [false]);
    if (bucketExists) {
      const path = `profiles/${session.uid}.jpg`;
      const token = randomUUID();
      await bucket.file(path).save(buffer, {
        resumable: false,
        contentType,
        metadata: { contentType, metadata: { firebaseStorageDownloadTokens: token } },
      });
      photoURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
    } else {
      if (imageBase64.length > 700_000) {
        throw new Error("Enable Firebase Storage to use photos this large.");
      }
      photoURL = `data:${contentType};base64,${imageBase64}`;
    }

    await getAdminDb()
      .doc(`staffProfiles/${session.uid}`)
      .set({ photoURL, email: session.email, updatedAt: FieldValue.serverTimestamp() }, { merge: true });

    return NextResponse.json({ photoURL });
  } catch (err) {
    return errorResponse(err);
  }
}
