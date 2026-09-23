"use client";

import { useActionState } from "react";
import { createPreInvite } from "@/app/actions/employee";
import { PurposeSelect } from "@/components/visit/purpose-select";
import { DateTimeField, defaultVisitFrom, defaultVisitTo } from "@/components/visit/date-time-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PreInviteForm({ remainingToday }: { remainingToday: number }) {
  const [state, formAction, pending] = useActionState(createPreInvite, {});

  return (
    <form action={formAction} className="w-full rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Pre-invite a visitor</h2>
          <p className="text-sm text-muted-foreground">{remainingToday} left today</p>
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
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="pre-company">Company</Label>
          <Input id="pre-company" name="company" placeholder="Optional" />
        </div>
        <div className="sm:col-span-2">
          <PurposeSelect id="pre-purpose" />
        </div>
        <DateTimeField
          id="pre-from"
          name="visitFrom"
          label="Visit from"
          defaultValue={defaultVisitFrom()}
        />
        <DateTimeField
          id="pre-to"
          name="visitTo"
          label="Visit to"
          defaultValue={defaultVisitTo()}
        />
      </div>
    </form>
  );
}
