import { EmployeeDashboard } from "@/components/employee/employee-dashboard";
import { SiteHeader } from "@/components/layout/site-header";
import { requireEmployee } from "@/lib/auth/guards";
import { buildCheckInUrl } from "@/lib/visits/pass-code";
import { countByStatus, serializeVisitLog } from "@/lib/visits/visit-log";
import { endOfLocalDay, startOfLocalDay } from "@/lib/visits/visit-window";
import { getAppUrl } from "@/lib/config/app-url";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export default async function EmployeeDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ invited?: string }>;
}) {
  const employee = await requireEmployee();
  const { invited } = await searchParams;

  const visits = await prisma.visit.findMany({
    where: { hostId: employee.id },
    include: {
      visitor: true,
      host: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const todayInvites = await prisma.visit.count({
    where: {
      hostId: employee.id,
      preApproved: true,
      createdAt: { gte: startOfLocalDay(), lte: endOfLocalDay() },
    },
  });

  const serialized = visits.map(serializeVisitLog);
  const pendingVisits = serialized.filter((v) => v.status === "PENDING");

  const latestInvite = invited
    ? visits.find((v) => v.id === invited && v.qrCode)
    : null;
  const inviteUrl = latestInvite?.qrCode
    ? buildCheckInUrl(latestInvite.qrCode, getAppUrl())
    : null;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
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
        <EmployeeDashboard
          employeeName={employee.fullName}
          department={employee.department}
          email={employee.email}
          maxVisitorsPerDay={employee.maxVisitorsPerDay}
          remainingToday={Math.max(0, employee.maxVisitorsPerDay - todayInvites)}
          inviteUrl={inviteUrl}
          visits={serialized}
          pendingVisits={pendingVisits}
          statusCounts={countByStatus(visits)}
        />
      </main>
    </div>
  );
}
