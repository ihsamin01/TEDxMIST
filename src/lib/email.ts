import "server-only";

import nodemailer from "nodemailer";
import { event } from "@/config/event";
import type { Registration } from "./supabase";

/**
 * Confirmation email, sent when someone is marked confirmed in /admin.
 * Goes through Gmail SMTP. GMAIL_APP_PASSWORD is a Google app password, not
 * the account password. See the README.
 */

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");

export const isEmailConfigured = Boolean(user && pass);

/** The From line. */
const from = `${event.name} <${user}>`;

/** Ticket number, shown at the gate. */
export function ticketCode(ticketNo: number | null) {
  if (!ticketNo) return "-";
  return `TEDXMIST-${String(ticketNo).padStart(3, "0")}`;
}

/* --------------------------------------------------------------------------
 * Template
 *
 * Tables and inline styles, because email clients drop most CSS. White
 * background, because many clients mangle dark ones.
 * ----------------------------------------------------------------------- */

const RED = "#eb0028";
const INK = "#0a0a0a";

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:7px 0;color:#666;font-size:13px;width:150px;vertical-align:top;">${label}</td>
      <td style="padding:7px 0;color:${INK};font-size:14px;font-weight:600;">${value}</td>
    </tr>`;
}

/** Everything here is user input, so escape it. */
function esc(value: string | null) {
  return (value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function confirmationEmailHtml(reg: Registration) {
  const ticket = ticketCode(reg.ticket_no);

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">

        <!-- Header -->
        <tr><td style="background:${INK};padding:26px 32px;">
          <span style="color:${RED};font-size:24px;font-weight:900;letter-spacing:-0.5px;">TEDx</span><span style="color:#ffffff;font-size:24px;font-weight:900;letter-spacing:-0.5px;">MIST</span>
          <div style="color:#a1a1a1;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-top:6px;">${esc(event.theme)}</div>
        </td></tr>

        <!-- Ticket -->
        <tr><td style="padding:36px 32px 8px;">
          <h1 style="margin:0 0 10px;color:${INK};font-size:26px;font-weight:900;letter-spacing:-0.5px;">Your seat is confirmed</h1>
          <p style="margin:0 0 26px;color:#555;font-size:15px;line-height:1.6;">
            Hi ${esc(reg.full_name)}, we have received your payment. You are on the list for ${esc(event.name)}.
          </p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid ${RED};border-radius:10px;">
            <tr><td align="center" style="padding:20px;">
              <div style="color:#666;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Your ticket number</div>
              <div style="color:${RED};font-size:30px;font-weight:900;letter-spacing:1px;margin-top:6px;">${ticket}</div>
              <div style="color:#666;font-size:12px;margin-top:8px;">Show this at the registration desk</div>
            </td></tr>
          </table>
        </td></tr>

        <!-- Event details -->
        <tr><td style="padding:30px 32px 0;">
          <div style="color:${RED};font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;border-bottom:1px solid #e5e5e5;padding-bottom:8px;">Event details</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;">
            ${row("Date", esc(event.dateLabel))}
            ${row("Time", esc(event.timeLabel))}
            ${row("Venue", esc(event.venue.hall))}
            ${row("Campus", esc(event.venue.name))}
            ${row("Address", esc(event.venue.address))}
            ${row("Map", `<a href="${esc(event.venue.mapUrl)}" style="color:${RED};">Open in Google Maps</a>`)}
          </table>
        </td></tr>

        <!-- What they gave us -->
        <tr><td style="padding:26px 32px 0;">
          <div style="color:${RED};font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;border-bottom:1px solid #e5e5e5;padding-bottom:8px;">Your registration</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;">
            ${row("Name", esc(reg.full_name))}
            ${row("University", esc(reg.university))}
            ${row("Department", esc(reg.department))}
            ${row("Year", esc(reg.study_year))}
            ${row("Transaction ID", esc(reg.transaction_id))}
            ${row("T-shirt", esc(reg.tshirt_size ?? "-"))}
          </table>
          <p style="margin:14px 0 0;color:#888;font-size:12px;line-height:1.6;">
            Something wrong above? Reply to this email and we will fix it.
          </p>
        </td></tr>

        <!-- On the day -->
        <tr><td style="padding:26px 32px 0;">
          <div style="color:${RED};font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;border-bottom:1px solid #e5e5e5;padding-bottom:8px;">On the day</div>
          <ul style="margin:12px 0 0;padding-left:18px;color:#444;font-size:14px;line-height:1.9;">
            <li>Bring your <strong>student ID card</strong> along with this ticket number.</li>
            <li>Arrive by <strong>09:30</strong>. The desk closes when the first talk starts.</li>
            <li>Seats are not numbered, so earlier arrival means a better view.</li>
            <li>Can't make it? Email us so we can give your seat to someone on the waiting list.</li>
          </ul>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:30px 32px 34px;">
          <div style="border-top:1px solid #e5e5e5;padding-top:18px;">
            <p style="margin:0 0 6px;color:#666;font-size:13px;">
              Questions? Write to <a href="mailto:${esc(event.contact.email)}" style="color:${RED};">${esc(event.contact.email)}</a>
            </p>
            <p style="margin:0;color:#999;font-size:11px;line-height:1.6;">
              This independent TEDx event is operated under license from TED.
            </p>
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Plain-text fallback. Also helps with spam filters. */
function text(reg: Registration) {
  return [
    `${event.name}: ${event.theme}`,
    "",
    "YOUR SEAT IS CONFIRMED",
    "",
    `Hi ${reg.full_name}, we have received your payment. You are on the list.`,
    "",
    `Ticket number: ${ticketCode(reg.ticket_no)}`,
    "Show this at the registration desk.",
    "",
    "EVENT DETAILS",
    `Date:    ${event.dateLabel}`,
    `Time:    ${event.timeLabel}`,
    `Venue:   ${event.venue.hall}`,
    `Campus:  ${event.venue.name}`,
    `Address: ${event.venue.address}`,
    `Map:     ${event.venue.mapUrl}`,
    "",
    "YOUR REGISTRATION",
    `Name:           ${reg.full_name}`,
    `University:     ${reg.university}`,
    `Department:     ${reg.department}`,
    `Year:           ${reg.study_year}`,
    `Transaction ID: ${reg.transaction_id}`,
    `T-shirt:        ${reg.tshirt_size ?? "-"}`,
    "",
    "ON THE DAY",
    "- Bring your student ID card along with this ticket number.",
    "- Arrive by 09:30; the desk closes when the first talk starts.",
    "- Seats are not numbered, so earlier arrival means a better view.",
    "- Can't make it? Email us so we can pass your seat on.",
    "",
    `Questions? ${event.contact.email}`,
    "This independent TEDx event is operated under license from TED.",
  ].join("\n");
}

/* --------------------------------------------------------------------------
 * Sending
 * ----------------------------------------------------------------------- */

export type SendResult = { ok: true } | { ok: false; error: string };

export async function sendConfirmationEmail(
  reg: Registration,
): Promise<SendResult> {
  if (!user || !pass) {
    return {
      ok: false,
      error: "GMAIL_USER and GMAIL_APP_PASSWORD are not set.",
    };
  }

  try {
    // 465 over 587, encrypted from the start. Works better on Vercel.
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    await transport.sendMail({
      from,
      to: reg.email,
      subject: `${event.name} registration confirmed, ticket ${ticketCode(reg.ticket_no)}`,
      html: confirmationEmailHtml(reg),
      text: text(reg),
      replyTo: event.contact.email || user,
      headers: {
        // Both of these help a little with spam filtering.
        "List-Unsubscribe": `<mailto:${user}?subject=Unsubscribe>`,
        "Auto-Submitted": "auto-generated",
      },
    });

    return { ok: true };
  } catch (cause) {
    return {
      ok: false,
      error: cause instanceof Error ? cause.message : "Unknown error",
    };
  }
}
