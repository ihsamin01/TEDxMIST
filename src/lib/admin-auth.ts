import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Password gate for /admin.
 *
 * There is one shared password, held in ADMIN_PASSWORD. Signing in stores a
 * cookie containing an HMAC derived from that password — knowing the cookie
 * value does not reveal the password, and the value cannot be forged without
 * it. Good enough for a table only the organizing team reads; if this ever
 * needs per-person accounts, swap it for Supabase Auth.
 */

export const COOKIE_NAME = "tedxmist_admin";
const SESSION_DAYS = 7;

export const isAdminConfigured = Boolean(process.env.ADMIN_PASSWORD);

function tokenFor(password: string) {
  return createHmac("sha256", password).update("tedxmist-admin").digest("hex");
}

/** Constant-time compare, so the check cannot be timed character by character. */
function matches(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/** True if the request carries a valid admin session cookie. */
export async function isSignedIn() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;

  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  if (!cookie) return false;

  return matches(cookie, tokenFor(password));
}

/** Checks the submitted password and, if it is right, starts a session. */
export async function signIn(submitted: string) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !matches(submitted, password)) return false;

  (await cookies()).set(COOKIE_NAME, tokenFor(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });

  return true;
}

export async function signOut() {
  (await cookies()).delete(COOKIE_NAME);
}
