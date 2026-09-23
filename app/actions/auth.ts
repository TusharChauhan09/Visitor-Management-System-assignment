"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { clearSession, setSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

type ActionState = { error?: string };

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  department: z.string().min(1),
  phone: z.string().min(1),
});

export async function registerEmployee(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Fill in every field. Password must be 8+ characters." };

  const existing = await prisma.employee.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { error: "An account with this email already exists." };

  const employee = await prisma.employee.create({
    data: { ...parsed.data, password: await hashPassword(parsed.data.password) },
  });

  await setSession("employee", employee.id);
  redirect("/employee/pending");
}

export async function loginEmployee(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter email and password." };

  const employee = await prisma.employee.findUnique({ where: { email: parsed.data.email } });
  if (!employee || !(await verifyPassword(parsed.data.password, employee.password))) {
    return { error: "Invalid email or password." };
  }

  await setSession("employee", employee.id);
  redirect(employee.isApproved ? "/employee" : "/employee/pending");
}

export async function loginAdmin(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter email and password." };

  const admin = await prisma.admin.findUnique({ where: { email: parsed.data.email } });
  if (!admin || !(await verifyPassword(parsed.data.password, admin.password))) {
    return { error: "Invalid email or password." };
  }

  await setSession("admin", admin.id);
  redirect("/admin");
}

export async function logout() {
  await clearSession();
  redirect("/login");
}
