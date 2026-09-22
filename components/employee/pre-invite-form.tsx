"use client";

import { useActionState } from "react";
import { createPreInvite } from "@/app/actions/employee";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fieldClass } from "@/lib/form";
import { VISIT_PURPOSE_OPTIONS } from "@/lib/visits/constants";
import {
  defaultVisitFromValue,
  defaultVisitToValue,
} from "@/lib/visits/visit-window";
import type { ActionState } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PreInviteForm({ remainingToday }: { remainingToday: number }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createPreInvite,
    {}
  );

  return (
    <form action={formAction} className="max-w-3xl rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Pre-invite a visitor</h2>
          <p className="text-sm text-muted-foreground">
            {remainingToday} left today
          </p>
        </div>
        <Button type="submit" disabled={pending || remainingToday <= 0}>
          {pending ? "Creating…" : "Send invite"}
        </Button>
      </div>

      {state.error ? (
        <p className="mb-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="pre-fullName">Visitor name</Label>
          <Input id="pre-fullName" name="fullName" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pre-email">Email</Label>
          <Input id="pre-email" name="email" type="email" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pre-phone">Phone</Label>
          <Input id="pre-phone" name="phone" type="tel" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pre-company">Company</Label>
          <Input id="pre-company" name="company" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pre-purpose">Purpose</Label>
          <select
            id="pre-purpose"
            name="purpose"
            required
            defaultValue=""
            className={cn(fieldClass)}
          >
            <option value="" disabled>Select purpose</option>
            {VISIT_PURPOSE_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pre-from">Visit from</Label>
          <Input
            id="pre-from"
            type="datetime-local"
            name="visitFrom"
            required
            defaultValue={defaultVisitFromValue()}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pre-to">Visit to</Label>
          <Input
            id="pre-to"
            type="datetime-local"
            name="visitTo"
            required
            defaultValue={defaultVisitToValue()}
          />
        </div>
      </div>
    </form>
  );
}
