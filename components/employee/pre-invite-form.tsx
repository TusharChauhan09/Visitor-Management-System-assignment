"use client";

import { useActionState } from "react";
import { createPreInvite } from "@/app/actions/employee";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="max-w-2xl bg-card/80 shadow-none">
      <form action={formAction}>
        <CardHeader>
          <CardTitle>Pre-invite a visitor</CardTitle>
          <CardDescription>
            {remainingToday} pre-invite{remainingToday === 1 ? "" : "s"} left today.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.error ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {state.error}
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="pre-fullName">Visitor name</Label>
              <Input id="pre-fullName" name="fullName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pre-email">Email</Label>
              <Input id="pre-email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pre-phone">Phone</Label>
              <Input id="pre-phone" name="phone" type="tel" required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="pre-company">Company (optional)</Label>
              <Input id="pre-company" name="company" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="pre-purpose">Purpose</Label>
              <select
                id="pre-purpose"
                name="purpose"
                required
                defaultValue=""
                className={cn(fieldClass, "h-8 px-2.5")}
              >
                <option value="" disabled>Select purpose</option>
                {VISIT_PURPOSE_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pre-from">Visit from</Label>
              <Input
                id="pre-from"
                type="datetime-local"
                name="visitFrom"
                required
                defaultValue={defaultVisitFromValue()}
              />
            </div>
            <div className="space-y-2">
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
        </CardContent>
        <CardFooter>
          <Button type="submit" size="lg" disabled={pending || remainingToday <= 0}>
            {pending ? "Creating invite…" : "Send pre-invite"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
