import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function saveUploadedImage(file: File): Promise<string> {
  if (!file || file.size === 0) throw new Error("Skedari është bosh.");
  const ext = EXT_BY_TYPE[file.type.toLowerCase()];
  if (!ext) throw new Error("Format imazhi i pasupportuar (JPG, PNG, WEBP, GIF, SVG).");
  if (file.size > MAX_BYTES) throw new Error("Skedari është më i madh se 5 MB.");

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, name), buf);
  return `/uploads/${name}`;
}
