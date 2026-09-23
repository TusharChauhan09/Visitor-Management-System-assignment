"use client";

import { useActionState, useState } from "react";
import { createVisitorEntry } from "@/app/actions/visits";
import { PhotoCapture } from "@/components/visit/photo-capture";
import { PurposeSelect } from "@/components/visit/purpose-select";
import { HostSearchField } from "@/components/visit/host-search-field";
import { formInputClassName } from "@/components/visit/form-styles";
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
    <form
      action={formAction}
      className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:items-start"
    >
      <input type="hidden" name="photoData" value={photoData} />

      <div className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <header>
          <h2 className="text-lg font-semibold tracking-tight">Visitor details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We will email your host to approve this visit before a pass is issued.
          </p>
        </header>

        {state.error ? (
          <p
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
            role="alert"
          >
            {state.error}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="v-name" className="sm:col-span-2">
            <Input id="v-name" name="fullName" autoComplete="name" required className={formInputClassName} />
          </Field>
          <Field label="Email" htmlFor="v-email">
            <Input
              id="v-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={formInputClassName}
            />
          </Field>
          <Field label="Mobile" htmlFor="v-phone">
            <Input
              id="v-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              className={formInputClassName}
            />
          </Field>
          <Field label="Company" htmlFor="v-company" className="sm:col-span-2">
            <Input
              id="v-company"
              name="company"
              placeholder="Optional"
              className={formInputClassName}
            />
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
          <div className="sm:col-span-2">
            <HostSearchField employees={employees} />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-11 w-full rounded-xl sm:w-auto sm:min-w-[12rem]"
          disabled={pending || !hasPhoto || !photoData}
        >
          {pending ? "Sending request…" : "Submit for host approval"}
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
        <p className="mb-3 text-sm font-semibold">Visitor photo</p>
        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">Required for the security desk.</p>
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
