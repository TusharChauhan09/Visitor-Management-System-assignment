import { PageShell } from "@/components/layout/page-shell";
import { PreInviteForm } from "@/components/employee/pre-invite-form";
import { VisitorStatusTable } from "@/components/employee/visitor-status-table";
import { logoutEmployee } from "@/app/actions/auth";
import { requireEmployee } from "@/lib/auth/guards";
import { buildCheckInUrl } from "@/lib/visits/pass-code";
import { toEmployeeVisitRows } from "@/lib/visits/employee-dashboard";
import { endOfLocalDay, startOfLocalDay } from "@/lib/visits/visit-window";
import { getAppUrl } from "@/lib/config/app-url";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/button";

export default async function EmployeeDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ invited?: string }>;
}) {
  const employee = await requireEmployee();
  const { invited } = await searchParams;

  const visits = await prisma.visit.findMany({
    where: { hostId: employee.id },
    include: { visitor: true },
    orderBy: { createdAt: "desc" },
  });

  const todayInvites = await prisma.visit.count({
    where: {
      hostId: employee.id,
      preApproved: true,
      createdAt: { gte: startOfLocalDay(), lte: endOfLocalDay() },
    },
  });

  const latestInvite = invited
    ? visits.find((v) => v.id === invited && v.qrCode)
    : null;
  const inviteUrl = latestInvite?.qrCode
    ? buildCheckInUrl(latestInvite.qrCode, getAppUrl())
    : null;

  return (
    <PageShell title="Employee portal">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{employee.fullName}</p>
          <p>{employee.department} · {employee.email}</p>
          <p className="mt-1">Daily pre-invite limit: {employee.maxVisitorsPerDay}</p>
        </div>
        <form action={logoutEmployee}>
          <Button type="submit" variant="outline" size="sm">Sign out</Button>
        </form>
      </div>

      {inviteUrl ? (
        <p className="mb-6 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
          Pre-invite created. Share check-in link:{" "}
          <a className="break-all font-medium text-foreground underline" href={inviteUrl}>
            {inviteUrl}
          </a>
        </p>
      ) : null}

      <div className="space-y-10">
        <PreInviteForm
          remainingToday={Math.max(0, employee.maxVisitorsPerDay - todayInvites)}
        />
        <section className="space-y-3">
          <h2 className="text-base font-semibold">Your visitors</h2>
          <VisitorStatusTable visits={toEmployeeVisitRows(visits)} />
        </section>
      </div>
    </PageShell>
  );
}
