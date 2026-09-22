"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/actions/auth";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/types";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    loginAdmin,
    {}
  );

  return (
    <PageShell title="Admin sign in" backHref="/" backLabel="Desk">
      <Card className="max-w-md bg-card/90 shadow-none">
        <form action={formAction}>
          <CardContent className="space-y-4 pt-6">
            {state.error ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {state.error}
              </p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input id="admin-email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input id="admin-password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" className="w-full" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </PageShell>
  );
}
