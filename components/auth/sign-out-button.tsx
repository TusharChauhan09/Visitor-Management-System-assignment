"use client";

import { logout } from "@/app/actions/auth";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function SignOutButton({
  size = "sm",
  variant = "outline",
}: {
  size?: "sm" | "default" | "lg";
  variant?: "outline" | "default" | "ghost";
}) {
  const { clear } = useAuth();

  return (
    <form
      action={logout}
      onSubmit={() => {
        clear();
      }}
    >
      <Button type="submit" variant={variant} size={size}>
        Sign out
      </Button>
    </form>
  );
}
