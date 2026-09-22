import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { DeskHomeLink, DeskLayout } from "@/components/layout/desk-layout";
import { requireAdmin } from "@/lib/auth/guards";
import type { AdminEmployeeEntry } from "@/lib/types";
import { countByStatus, serializeVisitLog } from "@/lib/visits/visit-log";
import { prisma } from "@/lib/db/prisma";

function toAdminEmployee(
  employee: {
    id: string;
    fullName: string;
    email: string;
    department: string;
    phone: string;
    isApproved: boolean;
    maxVisitorsPerDay: number;
    visits: { status: string }[];
  }
): AdminEmployeeEntry {
  const totalVisits = employee.visits.length;
  const pendingVisits = employee.visits.filter((v) => v.status === "PENDING").length;
  const checkedInVisits = employee.visits.filter((v) => v.status === "CHECKED_IN").length;

  return {
    id: employee.id,
    fullName: employee.fullName,
    email: employee.email,
    department: employee.department,
    phone: employee.phone,
    isApproved: employee.isApproved,
    maxVisitorsPerDay: employee.maxVisitorsPerDay,
    totalVisits,
    pendingVisits,
    checkedInVisits,
  };
}

export default async function AdminPage() {
  await requireAdmin();

  const [visits, employees] = await Promise.all([
    prisma.visit.findMany({
      include: { visitor: true, host: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.employee.findMany({
      orderBy: { fullName: "asc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        department: true,
        phone: true,
        isApproved: true,
        maxVisitorsPerDay: true,
        visits: { select: { status: true } },
      },
    }),
  ]);

  const employeeRows = employees.map(toAdminEmployee);
  const pendingEmployees = employeeRows
    .filter((e) => !e.isApproved)
    .map(({ id, fullName, email, department, phone }) => ({
      id,
      fullName,
      email,
      department,
      phone,
    }));

  return (
    <DeskLayout trailing={<DeskHomeLink />}>
      <AdminDashboard
        visits={visits.map(serializeVisitLog)}
        employees={employeeRows}
        pendingEmployees={pendingEmployees}
        statusCounts={countByStatus(visits)}
      />
    </DeskLayout>
  );
}
