"use client";

import { useCallback } from "react";
import { useAuthStore, type AuthUser } from "@/stores/auth-store";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clear = useAuthStore((state) => state.clear);
  const loginRole = useAuthStore((state) => state.loginRole);
  const setLoginRole = useAuthStore((state) => state.setLoginRole);

  const refresh = useCallback(async () => {
    const response = await fetch("/api/auth/session");
    const data = (await response.json()) as { user: AuthUser | null };
    setUser(data.user);
    return data.user;
  }, [setUser]);

  return {
    user,
    loginRole,
    setLoginRole,
    setUser,
    clear,
    refresh,
    isAdmin: user?.role === "admin",
    isEmployee: user?.role === "employee",
  };
}
