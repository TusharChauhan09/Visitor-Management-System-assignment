import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import type { AuthUser } from "@/stores/auth-store";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  if (session.role === "admin") {
    const admin = await prisma.admin.findUnique({ where: { id: session.id } });
    if (!admin) {
      return NextResponse.json({ user: null });
    }
    const user: AuthUser = { role: "admin", id: admin.id, email: admin.email };
    return NextResponse.json({ user });
  }

  const employee = await prisma.employee.findUnique({ where: { id: session.id } });
  if (!employee) {
    return NextResponse.json({ user: null });
  }

  const user: AuthUser = {
    role: "employee",
    id: employee.id,
    email: employee.email,
    fullName: employee.fullName,
    department: employee.department,
    isApproved: employee.isApproved,
  };
  return NextResponse.json({ user });
}
