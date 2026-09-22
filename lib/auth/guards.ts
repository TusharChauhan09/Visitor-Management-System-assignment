import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";

export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }

  const admin = await prisma.admin.findUnique({ where: { id: session.id } });
  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}

export async function requireEmployee() {
  const session = await getSession();
  if (!session || session.role !== "employee") {
    redirect("/employee/login");
  }

  const employee = await prisma.employee.findUnique({ where: { id: session.id } });
  if (!employee) {
    redirect("/employee/login");
  }

  if (!employee.isApproved) {
    redirect("/employee/pending");
  }

  return employee;
}

export async function getEmployeeSessionOptional() {
  const session = await getSession();
  if (!session || session.role !== "employee") {
    return null;
  }
  return prisma.employee.findUnique({ where: { id: session.id } });
}
