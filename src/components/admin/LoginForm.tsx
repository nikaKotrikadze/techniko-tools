"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Email
        <input name="email" type="email" required autoComplete="email" defaultValue={state?.values?.email} className="admin-input" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Password
        <input name="password" type="password" required autoComplete="current-password" className="admin-input" />
      </label>
      {state && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.message}
        </p>
      )}
      <button disabled={pending} className="admin-btn-primary">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
