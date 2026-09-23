"use client";

import { useEffect } from "react";
import { useAuthStore, type AuthUser } from "@/stores/auth-store";

export function AuthHydrator({ user }: { user: AuthUser | null }) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return null;
}
