/**
 * Field rules shared by the browser and the server.
 *
 * The registration form is two steps, so the first step has to be checked in
 * the browser before it will let anyone move on. The server then checks
 * everything again, because nothing the browser sends can be trusted.
 *
 * Both sides import from here so the two can never drift apart. This file has
 * no "use server" and no imports, so it is safe on either side.
 */

/**
 * Bangladeshi mobile numbers: 01, an operator digit, then eight more — eleven
 * digits in total. An optional +88 or 88 country code is allowed in front.
 */
export const PHONE = /^(\+?88)?01[3-9]\d{8}$/;

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * A link to an actual Facebook profile, not just the word "facebook". The
 * trailing path is required, so facebook.com on its own is rejected.
 */
export const FACEBOOK =
  /^https?:\/\/(www\.|m\.|web\.|mbasic\.)?(facebook\.com|fb\.com|fb\.me)\/[^/?#\s][^\s]*$/i;

/** People type spaces and dashes into phone numbers; those don't count. */
export function phoneOk(value: string): boolean {
  return PHONE.test(value.replace(/[\s-]/g, ""));
}

export function emailOk(value: string): boolean {
  return EMAIL.test(value);
}

/**
 * People type "facebook.com/x" as often as the full URL, so the scheme is
 * added before the link is checked.
 */
export function withScheme(value: string): string {
  if (!value || /^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export function facebookOk(value: string): boolean {
  return FACEBOOK.test(withScheme(value));
}

/** The one message both sides show for a bad phone number. */
export const PHONE_MESSAGE =
  "Enter an 11-digit Bangladeshi mobile number, for example 01712345678.";

export const EMAIL_MESSAGE = "That does not look like a valid email address.";

export const FACEBOOK_MESSAGE =
  "Paste the link to your Facebook profile, for example https://facebook.com/yourname.";
