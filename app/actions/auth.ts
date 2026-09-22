"use server";

import { redirect } from "next/navigation";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { clearSession, setSession } from "@/lib/auth/session";
import { requiredString } from "@/lib/form";
import { prisma } from "@/lib/db/prisma";
import type { ActionState } from "@/lib/types";

export async function registerEmployee(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const fullName = requiredString(formData, "fullName");
  const email = requiredString(formData, "email");
  const password = requiredString(formData, "password");
  const department = requiredString(formData, "department");
  const phone = requiredString(formData, "phone");

  if (!fullName || !email || !password || !department || !phone) {
    return { error: "Fill in every field." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const existing = await prisma.employee.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const employee = await prisma.employee.create({
    data: {
      fullName,
      email,
      password: await hashPassword(password),
      department,
      phone,
    },
  });

  await setSession({ role: "employee", id: employee.id });
  redirect("/employee/pending");
}

export async function loginEmployee(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = requiredString(formData, "email");
  const password = requiredString(formData, "password");

  if (!email || !password) {
    return { error: "Enter email and password." };
  }

  const employee = await prisma.employee.findUnique({ where: { email } });
  if (!employee || !(await verifyPassword(password, employee.password))) {
    return { error: "Invalid email or password." };
  }

  await setSession({ role: "employee", id: employee.id });
  redirect(employee.isApproved ? "/employee" : "/employee/pending");
}

export async function logoutEmployee() {
  await clearSession();
  redirect("/employee/login");
}

export async function loginAdmin(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = requiredString(formData, "email");
  const password = requiredString(formData, "password");

  if (!email || !password) {
    return { error: "Enter email and password." };
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !(await verifyPassword(password, admin.password))) {
    return { error: "Invalid email or password." };
  }

  await setSession({ role: "admin", id: admin.id });
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearSession();
  redirect("/admin/login");
}
