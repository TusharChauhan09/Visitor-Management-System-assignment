import { EmployeeDashboard } from "@/components/employee/employee-dashboard";
import { DeskHomeLink, DeskLayout } from "@/components/layout/desk-layout";
import { AuthHydrator } from "@/components/providers/auth-hydrator";
import { requireEmployee } from "@/lib/auth/guards";
import { checkInUrl, countByStatus, endOfDay, serializeVisit, startOfDay } from "@/lib/visits";
import { getAppUrl } from "@/lib/config/app-url";
import { prisma } from "@/lib/db/prisma";

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
      createdAt: { gte: startOfDay(), lte: endOfDay() },
    },
  });

  const serialized = visits.map(serializeVisit);
  const pendingVisits = serialized.filter((v) => v.status === "PENDING");

  const latestInvite = invited
    ? visits.find((v) => v.id === invited && v.qrCode)
    : null;
  const inviteUrl = latestInvite?.qrCode
    ? checkInUrl(latestInvite.qrCode, getAppUrl())
    : null;

  return (
    <DeskLayout trailing={<DeskHomeLink />}>
      <AuthHydrator
        user={{
          role: "employee",
          id: employee.id,
          email: employee.email,
          fullName: employee.fullName,
          department: employee.department,
          isApproved: employee.isApproved,
        }}
      />
      <EmployeeDashboard
        employeeName={employee.fullName}
        photoUrl={employee.photoUrl}
        department={employee.department}
        email={employee.email}
        maxVisitorsPerDay={employee.maxVisitorsPerDay}
        remainingToday={Math.max(0, employee.maxVisitorsPerDay - todayInvites)}
        inviteUrl={inviteUrl}
        visits={serialized}
        pendingVisits={pendingVisits}
        statusCounts={countByStatus(visits)}
      />
    </DeskLayout>
  );
}
