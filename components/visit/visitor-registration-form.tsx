"use client";

import { useActionState, useState } from "react";
import { createVisitorEntry } from "@/app/actions/visits";
import { PhotoCapture } from "@/components/visit/photo-capture";
import { PurposeSelect } from "@/components/visit/purpose-select";
import { DateTimeField, defaultVisitFrom, defaultVisitTo } from "@/components/visit/date-time-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function VisitorRegistrationForm({
  employees,
}: {
  employees: { id: string; fullName: string; department: string }[];
}) {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoData, setPhotoData] = useState("");
  const [state, formAction, pending] = useActionState(createVisitorEntry, {});

  if (employees.length === 0) {
    return (
      <p className="text-sm leading-relaxed text-muted-foreground">
        No approved host employees yet. Ask an employee to register and get admin approval.
      </p>
    );
  }

  return (
    <form action={formAction} className="mx-auto grid w-full max-w-5xl gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <input type="hidden" name="photoData" value={photoData} />

      <div className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5">
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
            <Input id="v-company" name="company" placeholder="Optional" />
          </Field>
          <div className="sm:col-span-2">
            <PurposeSelect id="v-purpose" />
          </div>
          <DateTimeField
            id="v-from"
            name="visitFrom"
            label="Visit from"
            defaultValue={defaultVisitFrom()}
          />
          <DateTimeField
            id="v-to"
            name="visitTo"
            label="Visit to"
            defaultValue={defaultVisitTo()}
          />
          <Field label="Host" htmlFor="v-host" className="sm:col-span-2">
            <select
              id="v-host"
              name="hostId"
              required
              defaultValue=""
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="" disabled>
                Select name and department
              </option>
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
          className="h-11 w-full sm:w-auto"
          disabled={pending || !hasPhoto || !photoData}
        >
          {pending ? "Sending request…" : "Submit for host approval"}
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
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
