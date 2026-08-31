"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, { error: "" });

  return (
    <form action={formAction} className="w-full max-w-sm">
      <p className="mb-2 text-xl font-black tracking-tight">
        <span className="text-ted">TEDx</span>
        <span className="text-white">MIST</span>
      </p>

      <h1 className="mb-8 text-sm font-semibold text-muted">
        Registrations, organizers only
      </h1>

      <label
        htmlFor="password"
        className="mb-2 block text-xs font-bold tracking-[0.12em] text-muted uppercase"
      >
        Password
      </label>

      <input
        id="password"
        name="password"
        type="password"
        autoFocus
        autoComplete="current-password"
        aria-invalid={Boolean(state.error)}
        className={`w-full rounded-xl border bg-ink-soft px-4 py-3 text-white transition outline-none focus:border-ted focus:ring-2 focus:ring-ted/30 ${
          state.error ? "border-ted" : "border-line"
        }`}
      />

      {state.error && (
        <p role="alert" className="mt-2 text-xs font-medium text-ted">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-full bg-ted px-6 py-3.5 font-bold text-white transition hover:bg-ted-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
