"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { lookupVisitStatus } from "@/app/actions/visits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function VisitStatusLookupForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(lookupVisitStatus, {});

  useEffect(() => {
    if (state.visitId) {
      router.push(`/entry/status/${state.visitId}`);
    }
  }, [state.visitId, router]);

  return (
    <form
      action={formAction}
      className="mx-auto w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-5 sm:p-6"
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        Enter the email from your registration. We&apos;ll show your latest visit, pass, and approval
        status.
      </p>

      {state.error ? (
        <p
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="status-email">Email</Label>
        <Input
          id="status-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <Button type="submit" size="lg" className="h-11 w-full" disabled={pending}>
        {pending ? "Looking up…" : "View my status"}
      </Button>
    </form>
  );
}
