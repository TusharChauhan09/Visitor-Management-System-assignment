"use client";

import { useActionState } from "react";
import { PhotoCapture } from "@/components/photo-capture";
import { Button } from "@/components/ui/button";
import { createVisitorEntry, type ActionState } from "@/app/actions/visits";

type EmployeeOption = {
  id: string;
  fullName: string;
  department: string;
};

const PURPOSE_OPTIONS = [
  "Meeting with an employee",
  "Interview",
  "Maintenance work",
  "Delivery",
  "Vendor visit",
  "Other",
];

const fieldClass =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function VisitorRegistrationForm({
  employees,
}: {
  employees: EmployeeOption[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createVisitorEntry,
    {}
  );

  if (employees.length === 0) {
    return (
      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
        No host employees are in the system yet. Run{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          npm run db:seed
        </code>{" "}
        to add one.
      </p>
    );
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-8">
      {state.error ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Visitor details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Legal name and contact as captured at the desk.
          </p>
        </div>
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
            <span className="text-sm font-medium">
              Company <span className="font-normal text-muted-foreground">(if representing a business)</span>
            </span>
            <input name="company" className={fieldClass} />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Visit</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Why you are here and who you are visiting.
          </p>
        </div>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Purpose of visit</span>
          <select name="purpose" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Select a purpose
            </option>
            {PURPOSE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Host employee</span>
          <select name="hostId" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Select name and department
            </option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.fullName} — {employee.department}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Photo</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Required at the desk for identity verification.
          </p>
        </div>
        <div className="max-w-sm">
          <PhotoCapture name="photoData" />
        </div>
      </section>

      <Button type="submit" size="lg" className="h-11 px-6" disabled={pending}>
        {pending ? "Sending request…" : "Submit for host approval"}
      </Button>
    </form>
  );
}
