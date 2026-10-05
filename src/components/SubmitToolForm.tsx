"use client";

import { useActionState } from "react";
import { submitTool } from "@/app/actions";

const FIELDS = [
  { name: "tool_name", label: "Tool name", type: "text", autoComplete: "off", placeholder: "e.g. Gamma" },
  { name: "website_url", label: "Website", type: "text", autoComplete: "url", placeholder: "gamma.app", inputMode: "url" },
  { name: "contact_email", label: "Your email", type: "email", autoComplete: "email", placeholder: "you@email.com", inputMode: "email" },
] as const;

const input =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-base outline-none focus:border-accent aria-invalid:border-red-500";

export function SubmitToolForm() {
  const [state, action, pending] = useActionState(submitTool, null);

  if (state?.ok) {
    return (
      <p role="status" className="rounded-2xl bg-accent/10 p-6 font-medium text-accent">
        {state.message}
      </p>
    );
  }

  const error = (name: string) =>
    state?.errors?.[name] && (
      <p id={`${name}-error`} className="text-sm text-red-600 dark:text-red-400">
        {state.errors[name]}
      </p>
    );

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      {FIELDS.map((f) => (
        <div key={f.name} className="flex flex-col gap-1.5">
          <label htmlFor={f.name} className="text-sm font-medium">
            {f.label}
          </label>
          <input
            id={f.name}
            name={f.name}
            type={f.type}
            required
            autoComplete={f.autoComplete}
            placeholder={f.placeholder}
            inputMode={"inputMode" in f ? f.inputMode : undefined}
            defaultValue={state?.values?.[f.name]}
            aria-invalid={state?.errors?.[f.name] ? true : undefined}
            aria-describedby={state?.errors?.[f.name] ? `${f.name}-error` : undefined}
            className={input}
          />
          {error(f.name)}
        </div>
      ))}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Why should I review it? <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          defaultValue={state?.values?.message}
          aria-invalid={state?.errors?.message ? true : undefined}
          aria-describedby={state?.errors?.message ? "message-error" : undefined}
          className={input}
        />
        {error("message")}
      </div>
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {state && !state.ok && (
        <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
          {state.message}
        </p>
      )}
      <button
        disabled={pending}
        className="rounded-xl bg-accent px-6 py-3.5 font-semibold text-white transition hover:opacity-90 disabled:opacity-60 sm:self-start dark:text-black"
      >
        {pending ? "Sending…" : "Submit tool"}
      </button>
    </form>
  );
}
