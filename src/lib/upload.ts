import crypto from "node:crypto";
import { bucket } from "./firebase-admin";

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

const MAX_BYTES = 5 * 1024 * 1024;

export async function saveUploadedImage(file: File): Promise<string> {
  if (!file || file.size === 0) throw new Error("Skedari është bosh.");
  const ext = EXT_BY_TYPE[file.type.toLowerCase()];
  if (!ext) throw new Error("Format imazhi i pasupportuar (JPG, PNG, WEBP, GIF, SVG).");
  if (file.size > MAX_BYTES) throw new Error("Skedari është më i madh se 5 MB.");

  const name = `uploads/${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const fileRef = bucket.file(name);
  await fileRef.save(buf, {
    contentType: file.type,
    metadata: { cacheControl: "public, max-age=31536000, immutable" },
    resumable: false,
  });
  await fileRef.makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${name}`;
}
