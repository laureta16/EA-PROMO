import { cookies } from "next/headers";
import crypto from "node:crypto";

const COOKIE_NAME = "eapromo_admin";
const MAX_AGE = 60 * 60 * 24 * 7;

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET env var is not set");
  return s;
}

function sign(value: string): string {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

function makeToken(): string {
  const payload = `${Date.now()}.${crypto.randomBytes(16).toString("hex")}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [ts, nonce, sig] = parts;
  if (sign(`${ts}.${nonce}`) !== sig) return false;
  const age = Date.now() - Number(ts);
  return Number.isFinite(age) && age < MAX_AGE * 1000;
}

export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  return verifyToken(c.get(COOKIE_NAME)?.value);
}

export async function login(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) return false;
  const c = await cookies();
  c.set(COOKIE_NAME, makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return true;
}

export async function logout() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}
