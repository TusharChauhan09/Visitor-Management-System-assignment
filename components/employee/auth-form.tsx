"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/lib/form";
import type { ActionState } from "@/lib/types";

type EmployeeAuthFormProps = {
  mode: "login" | "register";
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
};

export function EmployeeAuthForm({ mode, action }: EmployeeAuthFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-md space-y-4">
      {state.error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      {mode === "register" ? (
        <>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Full name</span>
            <input name="fullName" required className={fieldClass} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Department</span>
            <input name="department" required className={fieldClass} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Phone</span>
            <input name="phone" type="tel" required className={fieldClass} />
          </label>
        </>
      ) : null}

      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Work email</span>
        <input name="email" type="email" required autoComplete="email" className={fieldClass} />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Password</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          className={fieldClass}
        />
      </label>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
      </Button>
    </form>
  );
}
