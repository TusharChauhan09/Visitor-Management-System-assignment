"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";

export async function approveEmployeeForm(formData: FormData) {
  await requireAdmin();
  const id = formData.get("employeeId");
  if (typeof id !== "string" || !id) {
    return;
  }
  await prisma.employee.update({
    where: { id },
    data: { isApproved: true },
  });
  revalidatePath("/admin");
  revalidatePath("/employee");
}

export async function rejectEmployeeForm(formData: FormData) {
  await requireAdmin();
  const id = formData.get("employeeId");
  if (typeof id !== "string" || !id) {
    return;
  }
  await prisma.employee.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/employee");
}
