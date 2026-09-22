import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { SiteHeader } from "@/components/layout/site-header";
import { requireAdmin } from "@/lib/auth/guards";
import type { AdminEmployeeEntry } from "@/lib/types";
import { countByStatus, serializeVisitLog } from "@/lib/visits/visit-log";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

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
    <div className="flex min-h-full flex-1 flex-col bg-background app-mesh-bg">
      <SiteHeader
        trailing={
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Desk
          </Link>
        }
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 lg:py-10">
        <AdminDashboard
          visits={visits.map(serializeVisitLog)}
          employees={employeeRows}
          pendingEmployees={pendingEmployees}
          statusCounts={countByStatus(visits)}
        />
      </main>
    </div>
  );
}
