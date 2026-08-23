"use client";

import { useState, useTransition } from "react";
import { resendConfirmation, setStatus } from "@/app/admin/actions";
import type { StatusResult } from "@/app/admin/actions";
import type { Registration } from "@/lib/supabase";

const STYLES: Record<Registration["status"], string> = {
  pending: "border-white/25 text-white/70",
  confirmed: "border-ted bg-ted/15 text-ted",
  rejected: "border-line text-muted line-through",
};

/**
 * The payment column. Changing it writes straight to the database, and
 * Confirmed is what sends the email.
 */
export default function StatusSelect({
  id,
  status,
  sentAt,
}: {
  id: string;
  status: Registration["status"];
  sentAt: string | null;
}) {
  const [pending, startTransition] = useTransition();

  // Only about the click just made; `sentAt` covers everything before.
  const [result, setResult] = useState<StatusResult | null>(null);

  const run = (action: () => Promise<StatusResult>) =>
    startTransition(async () => {
      try {
        setResult(await action());
      } catch {
        setResult({ ok: false, emailed: false, error: "Something went wrong." });
      }
    });

  const emailed = Boolean(sentAt) || result?.emailed;

  return (
    <div className="min-w-[9rem]">
      <select
        value={status}
        disabled={pending}
        aria-label="Payment status"
        onChange={(e) => {
          const next = e.target.value as Registration["status"];
          setResult(null);
          run(() => setStatus(id, next));
        }}
        className={`cursor-pointer appearance-none rounded-full border bg-transparent px-3 py-1.5 text-xs font-bold transition outline-none focus:ring-2 focus:ring-ted/30 disabled:opacity-50 ${STYLES[status]}`}
      >
        <option value="pending" className="bg-ink text-white">
          Pending
        </option>
        <option value="confirmed" className="bg-ink text-white">
          Confirmed
        </option>
        <option value="rejected" className="bg-ink text-white">
          Rejected
        </option>
      </select>

      {pending && <p className="mt-1.5 text-[0.65rem] text-muted">Saving…</p>}

      {!pending && result?.error && (
        <p className="mt-1.5 text-[0.65rem] leading-snug text-ted">
          Email failed: {result.error}{" "}
          <button
            type="button"
            onClick={() => run(() => resendConfirmation(id))}
            className="font-bold underline"
          >
            Retry
          </button>
        </p>
      )}

      {!pending && !result?.error && emailed && (
        <p className="mt-1.5 flex items-center gap-1 text-[0.65rem] text-muted">
          <span aria-hidden>✓</span> Email sent
          <button
            type="button"
            onClick={() => run(() => resendConfirmation(id))}
            className="ml-1 underline hover:text-ted"
          >
            resend
          </button>
        </p>
      )}
    </div>
  );
}
