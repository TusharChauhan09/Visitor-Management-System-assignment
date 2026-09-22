"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/actions/auth";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/lib/form";
import type { ActionState } from "@/lib/types";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    loginAdmin,
    {}
  );

  return (
    <PageShell title="Admin sign in" backHref="/" backLabel="Desk">
      <form action={formAction} className="max-w-md space-y-4">
        {state.error ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {state.error}
          </p>
        ) : null}
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Email</span>
          <input name="email" type="email" required className={fieldClass} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Password</span>
          <input name="password" type="password" required className={fieldClass} />
        </label>
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </PageShell>
  );
}
