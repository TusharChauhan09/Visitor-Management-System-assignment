import { AdminDashboard } from "@/components/admin/admin-dashboard";
import type { Host } from "@/components/admin/employee-directory";
import { DeskHomeLink, DeskLayout } from "@/components/layout/desk-layout";
import { AuthHydrator } from "@/components/providers/auth-hydrator";
import { requireAdmin } from "@/lib/auth/guards";
import { countByStatus, serializeVisit } from "@/lib/visits";
import { prisma } from "@/lib/db/prisma";

function toHost(employee: {
  id: string;
  fullName: string;
  email: string;
  department: string;
  phone: string;
  isApproved: boolean;
  maxVisitorsPerDay: number;
  visits: { status: string }[];
}): Host {
  return {
    id: employee.id,
    fullName: employee.fullName,
    email: employee.email,
    department: employee.department,
    phone: employee.phone,
    isApproved: employee.isApproved,
    maxVisitorsPerDay: employee.maxVisitorsPerDay,
    totalVisits: employee.visits.length,
    pendingVisits: employee.visits.filter((v) => v.status === "PENDING").length,
    checkedInVisits: employee.visits.filter((v) => v.status === "CHECKED_IN").length,
  };
}

export default async function AdminPage() {
  const admin = await requireAdmin();

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

  const employeeRows = employees.map(toHost);
  const pendingEmployees = employeeRows.filter((e) => !e.isApproved);

  return (
    <DeskLayout trailing={<DeskHomeLink />}>
      <AuthHydrator user={{ role: "admin", id: admin.id, email: admin.email }} />
      <AdminDashboard
        visits={visits.map(serializeVisit)}
        employees={employeeRows}
        pendingEmployees={pendingEmployees}
        statusCounts={countByStatus(visits)}
      />
    </DeskLayout>
  );
}
