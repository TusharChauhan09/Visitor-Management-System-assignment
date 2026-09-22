"use client";

import { useActionState, useState } from "react";
import { createVisitorEntry } from "@/app/actions/visits";
import { PhotoCapture } from "@/components/visit/photo-capture";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fieldClass } from "@/lib/form";
import { cn } from "@/lib/utils";
import type { ActionState, EmployeeOption } from "@/lib/types";
import { VISIT_PURPOSE_OPTIONS } from "@/lib/visits/constants";
import {
  defaultVisitFromValue,
  defaultVisitToValue,
} from "@/lib/visits/visit-window";

export function VisitorRegistrationForm({
  employees,
}: {
  employees: EmployeeOption[];
}) {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoData, setPhotoData] = useState("");
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createVisitorEntry,
    {}
  );

  if (employees.length === 0) {
    return (
      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
        No approved host employees yet. Ask an employee to register and get admin approval.
      </p>
    );
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <input type="hidden" name="photoData" value={photoData} />

      {state.error ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <Card className="bg-card/90 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Visitor details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="v-name">Full name</Label>
            <Input id="v-name" name="fullName" autoComplete="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-email">Email</Label>
            <Input id="v-email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-phone">Mobile number</Label>
            <Input id="v-phone" name="phone" type="tel" autoComplete="tel" required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="v-company">Company (optional)</Label>
            <Input id="v-company" name="company" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/90 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Visit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="v-purpose">Purpose</Label>
            <select
              id="v-purpose"
              name="purpose"
              required
              defaultValue=""
              className={cn(fieldClass, "h-8 px-2.5")}
            >
              <option value="" disabled>Select a purpose</option>
              {VISIT_PURPOSE_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="v-from">Visit from</Label>
              <Input
                id="v-from"
                type="datetime-local"
                name="visitFrom"
                required
                defaultValue={defaultVisitFromValue()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v-to">Visit to</Label>
              <Input
                id="v-to"
                type="datetime-local"
                name="visitTo"
                required
                defaultValue={defaultVisitToValue()}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-host">Host employee</Label>
            <select
              id="v-host"
              name="hostId"
              required
              defaultValue=""
              className={cn(fieldClass, "h-8 px-2.5")}
            >
              <option value="" disabled>Select name and department</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.fullName} — {employee.department}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/90 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm">
            <PhotoCapture onPhotoChange={setHasPhoto} onCapture={setPhotoData} />
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        size="lg"
        className="h-11 px-6"
        disabled={pending || !hasPhoto || !photoData}
      >
        {pending ? "Sending request…" : "Submit for host approval"}
      </Button>
    </form>
  );
}
