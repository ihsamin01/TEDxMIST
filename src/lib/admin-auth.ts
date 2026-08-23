import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Password gate for /admin. One shared password in ADMIN_PASSWORD; the session
 * cookie holds an HMAC of it, so it can't be forged and doesn't leak the
 * password. If we ever need per-person logins, use Supabase Auth instead.
 */

export const COOKIE_NAME = "tedxmist_admin";
const SESSION_DAYS = 7;

export const isAdminConfigured = Boolean(process.env.ADMIN_PASSWORD);

function tokenFor(password: string) {
  return createHmac("sha256", password).update("tedxmist-admin").digest("hex");
}

/** Constant-time compare, so the password can't be guessed by timing. */
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
