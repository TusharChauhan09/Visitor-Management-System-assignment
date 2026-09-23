"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AuthPanel, authInputClassName } from "@/components/auth/auth-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type EmployeeAuthFormProps = {
  action: (prev: { error?: string }, formData: FormData) => Promise<{ error?: string }>;
};

const fields = [
  { id: "fullName", name: "fullName", label: "Full name", type: "text", autoComplete: "name" },
  { id: "department", name: "department", label: "Department", type: "text", autoComplete: "organization" },
  { id: "phone", name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { id: "email", name: "email", label: "Work email", type: "email", autoComplete: "email" },
] as const;

export function EmployeeAuthForm({ action }: EmployeeAuthFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <AuthPanel>
      <h1 className="pr-12 text-2xl font-semibold tracking-tight">Get employee access</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        An admin approves the account before you can host visitors.
      </p>

      <form action={formAction} className="mt-6 space-y-3">
        {state.error ? (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {state.error}
          </p>
        ) : null}

        {fields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="sr-only">
              {field.label}
            </label>
            <Input
              id={field.id}
              name={field.name}
              type={field.type}
              required
              autoComplete={field.autoComplete}
              placeholder={field.label}
              className={authInputClassName}
            />
          </div>
        ))}

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Password, at least 8 characters"
            className={authInputClassName}
          />
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="mt-2 h-12 w-full rounded-xl text-base font-semibold"
        >
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthPanel>
  );
}
