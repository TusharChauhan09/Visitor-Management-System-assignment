"use client";

import { useActionState, useState } from "react";
import { createVisitorEntry } from "@/app/actions/visits";
import { PhotoCapture } from "@/components/visit/photo-capture";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/lib/form";
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
    <form action={formAction} className="max-w-2xl space-y-8">
      <input type="hidden" name="photoData" value={photoData} />

      {state.error ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-base font-semibold tracking-tight">Visitor details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-sm font-medium">Full name</span>
            <input name="fullName" autoComplete="name" required className={fieldClass} />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium">Email</span>
            <input name="email" type="email" autoComplete="email" required className={fieldClass} />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium">Mobile number</span>
            <input name="phone" type="tel" autoComplete="tel" required className={fieldClass} />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-sm font-medium">Company (optional)</span>
            <input name="company" className={fieldClass} />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold tracking-tight">Visit</h2>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Purpose</span>
          <select name="purpose" required defaultValue="" className={fieldClass}>
            <option value="" disabled>Select a purpose</option>
            {VISIT_PURPOSE_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
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
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Host employee</span>
          <select name="hostId" required defaultValue="" className={fieldClass}>
            <option value="" disabled>Select name and department</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.fullName} — {employee.department}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold tracking-tight">Photo</h2>
        <div className="max-w-sm">
          <PhotoCapture onPhotoChange={setHasPhoto} onCapture={setPhotoData} />
        </div>
      </section>

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
