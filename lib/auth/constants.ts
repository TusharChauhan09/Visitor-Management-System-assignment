/** Cookie name and `role:id` format — shared by proxy (edge) and session (server). */
export const SESSION_COOKIE = "vms_session";

export type SessionRole = "employee" | "admin";

export type SessionPayload = {
  role: SessionRole;
  id: string;
};

export function parseSessionCookie(value: string | undefined | null): SessionPayload | null {
  if (!value) return null;
  const [role, id] = value.split(":");
  if ((role !== "employee" && role !== "admin") || !id) return null;
  return { role, id };
}
