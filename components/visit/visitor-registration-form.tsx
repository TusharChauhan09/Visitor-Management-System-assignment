"use client";

import { useActionState, useState } from "react";
import { createVisitorEntry } from "@/app/actions/visits";
import { PhotoCapture } from "@/components/visit/photo-capture";
import { Button } from "@/components/ui/button";
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
    <form action={formAction} className="grid h-full min-h-0 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
      <input type="hidden" name="photoData" value={photoData} />

      <div className="min-h-0 space-y-3 overflow-auto rounded-lg border border-border bg-card p-4">
        {state.error ? (
          <p
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {state.error}
          </p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Full name" htmlFor="v-name" className="sm:col-span-2">
            <Input id="v-name" name="fullName" autoComplete="name" required />
          </Field>
          <Field label="Email" htmlFor="v-email">
            <Input id="v-email" name="email" type="email" autoComplete="email" required />
          </Field>
          <Field label="Mobile" htmlFor="v-phone">
            <Input id="v-phone" name="phone" type="tel" autoComplete="tel" required />
          </Field>
          <Field label="Company" htmlFor="v-company" className="sm:col-span-2">
            <Input id="v-company" name="company" />
          </Field>
          <Field label="Purpose" htmlFor="v-purpose" className="sm:col-span-2">
            <select
              id="v-purpose"
              name="purpose"
              required
              defaultValue=""
              className={cn(fieldClass)}
            >
              <option value="" disabled>Select a purpose</option>
              {VISIT_PURPOSE_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </Field>
          <Field label="Visit from" htmlFor="v-from">
            <Input
              id="v-from"
              type="datetime-local"
              name="visitFrom"
              required
              defaultValue={defaultVisitFromValue()}
            />
          </Field>
          <Field label="Visit to" htmlFor="v-to">
            <Input
              id="v-to"
              type="datetime-local"
              name="visitTo"
              required
              defaultValue={defaultVisitToValue()}
            />
          </Field>
          <Field label="Host" htmlFor="v-host" className="sm:col-span-2">
            <select
              id="v-host"
              name="hostId"
              required
              defaultValue=""
              className={cn(fieldClass)}
            >
              <option value="" disabled>Select name and department</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.fullName} — {employee.department}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-1 w-full sm:w-auto"
          disabled={pending || !hasPhoto || !photoData}
        >
          {pending ? "Sending request…" : "Submit for host approval"}
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-3 text-sm font-medium">Visitor photo</p>
        <PhotoCapture compact onPhotoChange={setHasPhoto} onCapture={setPhotoData} />
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
