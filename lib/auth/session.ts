import { cookies } from "next/headers";

const COOKIE = "vms_session";

export async function setSession(role: "employee" | "admin", id: string) {
  (await cookies()).set(COOKIE, `${role}:${id}`, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

export async function getSession() {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return null;
  const [role, id] = value.split(":");
  if ((role !== "employee" && role !== "admin") || !id) return null;
  return { role, id };
}
