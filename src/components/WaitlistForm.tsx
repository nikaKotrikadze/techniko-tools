"use client";

import { useActionState, useId } from "react";
import { joinWaitlist } from "@/app/actions";

export function WaitlistForm({ className = "" }: { className?: string }) {
  const [state, action, pending] = useActionState(joinWaitlist, null);
  const id = useId();

  if (state?.ok) {
    return (
      <p role="status" className={`rounded-xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent ${className}`}>
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className={`flex flex-col gap-2 ${className}`} noValidate>
      <label htmlFor={`${id}-email`} className="sr-only">
        Email address
      </label>
      <div className="flex gap-2">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@email.com"
          defaultValue={state?.values?.email}
          aria-invalid={state ? true : undefined}
          aria-describedby={state ? `${id}-error` : undefined}
          className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-accent aria-invalid:border-red-500"
        />
        <input name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        <button
          disabled={pending}
          className="shrink-0 rounded-xl bg-accent px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60 dark:text-black"
        >
          {pending ? "Joining…" : "Join"}
        </button>
      </div>
      {state && (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.message}
        </p>
      )}
    </form>
  );
}
