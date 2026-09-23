import { parseSessionCookie, SESSION_COOKIE } from "@/lib/auth/constants";
import { cookies } from "next/headers";

/** Server-only: set/clear/read session after login, logout, and in server actions. */
export async function setSession(role: "employee" | "admin", id: string) {
  const secure = process.env.NODE_ENV === "production";
  (await cookies()).set(SESSION_COOKIE, `${role}:${id}`, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession() {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  return parseSessionCookie(value);
}
