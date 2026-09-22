"use client";

import { useActionState } from "react";
import { createPreInvite } from "@/app/actions/employee";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/lib/form";
import { VISIT_PURPOSE_OPTIONS } from "@/lib/visits/constants";
import {
  defaultVisitFromValue,
  defaultVisitToValue,
} from "@/lib/visits/visit-window";
import type { ActionState } from "@/lib/types";

export function PreInviteForm({ remainingToday }: { remainingToday: number }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createPreInvite,
    {}
  );

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-border p-6">
      <div>
        <h2 className="text-base font-semibold">Pre-invite a visitor</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {remainingToday} pre-invite{remainingToday === 1 ? "" : "s"} left today.
        </p>
      </div>

      {state.error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 sm:col-span-2">
          <span className="text-sm font-medium">Visitor name</span>
          <input name="fullName" required className={fieldClass} />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Email</span>
          <input name="email" type="email" required className={fieldClass} />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Phone</span>
          <input name="phone" type="tel" required className={fieldClass} />
        </label>
        <label className="space-y-1.5 sm:col-span-2">
          <span className="text-sm font-medium">Company (optional)</span>
          <input name="company" className={fieldClass} />
        </label>
        <label className="space-y-1.5 sm:col-span-2">
          <span className="text-sm font-medium">Purpose</span>
          <select name="purpose" required defaultValue="" className={fieldClass}>
            <option value="" disabled>Select purpose</option>
            {VISIT_PURPOSE_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Visit from</span>
          <input
            type="datetime-local"
            name="visitFrom"
            required
            defaultValue={defaultVisitFromValue()}
            className={fieldClass}
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Visit to</span>
          <input
            type="datetime-local"
            name="visitTo"
            required
            defaultValue={defaultVisitToValue()}
            className={fieldClass}
          />
        </label>
      </div>

      <Button type="submit" size="lg" disabled={pending || remainingToday <= 0}>
        {pending ? "Creating invite…" : "Send pre-invite"}
      </Button>
    </form>
  );
}
