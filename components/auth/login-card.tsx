"use client";

import { useState } from "react";
import Link from "next/link";
import { useActionState } from "react";
import { loginAdmin, loginEmployee } from "@/app/actions/auth";
import { AuthPanel, authInputClassName } from "@/components/auth/auth-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Role = "employee" | "admin";

export function LoginCard({ initialRole = "employee" }: { initialRole?: Role }) {
  const [role, setRole] = useState<Role>(initialRole);

  return (
    <AuthPanel>
      <div
        className="inline-flex rounded-full bg-muted p-1"
        role="tablist"
        aria-label="Account type"
      >
        <RoleTab active={role === "employee"} onClick={() => setRole("employee")}>
          Employee
        </RoleTab>
        <RoleTab active={role === "admin"} onClick={() => setRole("admin")}>
          Admin
        </RoleTab>
      </div>

      <h1 className="mt-7 text-2xl font-semibold tracking-tight">
        {role === "employee" ? "Employee sign in" : "Admin sign in"}
      </h1>

      <div className="mt-6">
        {role === "employee" ? (
          <CredentialForm
            action={loginEmployee}
            emailId="employee-email"
            passwordId="employee-password"
            emailAutoComplete="username"
          />
        ) : (
          <CredentialForm
            action={loginAdmin}
            emailId="admin-email"
            passwordId="admin-password"
            emailAutoComplete="username"
          />
        )}
      </div>

      {role === "employee" ? (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Need access?{" "}
          <Link
            href="/employee/register"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Register as an employee
          </Link>
        </p>
      ) : (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Admin accounts are issued by the desk.
        </p>
      )}
    </AuthPanel>
  );
}

function RoleTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "h-9 rounded-full px-4 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function CredentialForm({
  action,
  emailId,
  passwordId,
  emailAutoComplete,
}: {
  action: (prev: { error?: string }, formData: FormData) => Promise<{ error?: string }>;
  emailId: string;
  passwordId: string;
  emailAutoComplete: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-3">
      {state.error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
      <div>
        <label htmlFor={emailId} className="sr-only">
          Email
        </label>
        <Input
          id={emailId}
          name="email"
          type="email"
          required
          autoComplete={emailAutoComplete}
          placeholder="Work email"
          className={authInputClassName}
        />
      </div>
      <div>
        <label htmlFor={passwordId} className="sr-only">
          Password
        </label>
        <Input
          id={passwordId}
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Password"
          className={authInputClassName}
        />
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="mt-2 h-12 w-full rounded-xl text-base font-semibold"
      >
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
