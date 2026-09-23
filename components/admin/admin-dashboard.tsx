"use client";

import { useRouter } from "next/navigation";
import { approveEmployeeForm, rejectEmployeeForm } from "@/app/actions/admin";
import { EmployeeDirectory, type Host } from "@/components/admin/employee-directory";
import { SignOutButton } from "@/components/auth/sign-out-button";
import type { VisitRow } from "@/lib/visits";
import { StatCards } from "@/components/dashboard/stat-cards";
import { DashboardFrame } from "@/components/dashboard/dashboard-frame";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { VisitLogTable } from "@/components/dashboard/visit-log-table";
import { useAdminDashboard } from "@/hooks/use-admin-dashboard";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

type AdminDashboardProps = {
  visits: VisitRow[];
  employees: Host[];
  pendingEmployees: Host[];
  statusCounts: Record<string, number>;
};

export function AdminDashboard({
  visits,
  employees,
  pendingEmployees,
  statusCounts,
}: AdminDashboardProps) {
  const router = useRouter();
  const {
    notifyOpen,
    selectedEmployee,
    openNotifications,
    closeNotifications,
    setSelectedEmployeeId,
  } = useAdminDashboard(pendingEmployees);

  const stats = [
    { label: "Total visits", value: visits.length },
    { label: "Pending approval", value: statusCounts.PENDING ?? 0 },
    { label: "On site", value: statusCounts.CHECKED_IN ?? 0 },
    { label: "Employees", value: employees.length },
    { label: "Access requests", value: pendingEmployees.length },
  ];

  const headerActions = (
    <>
      <NotificationBell
        count={pendingEmployees.length}
        label="Employee access requests"
        onClick={openNotifications}
      />
      <SignOutButton />
    </>
  );

  return (
    <>
      <DashboardFrame
        title="Admin"
        description="Visitor floor and host access"
        actions={headerActions}
        defaultTab="visitors"
        tabs={[
          {
            value: "visitors",
            label: "Visits",
            badge: visits.length,
            content: (
              <div className="flex min-h-0 flex-1 flex-col gap-3">
                <StatCards stats={stats} />
                <VisitLogTable visits={visits} showHost showTimeline />
              </div>
            ),
          },
          {
            value: "employees",
            label: "Hosts",
            badge: employees.length,
            content: <EmployeeDirectory employees={employees} />,
          },
        ]}
      />

      <Modal
        open={notifyOpen}
        title="Employee access requests"
        onClose={closeNotifications}
        wide
      >
        {pendingEmployees.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending employee registrations.</p>
        ) : (
          <ul className="space-y-3">
            {pendingEmployees.map((employee) => (
              <li
                key={employee.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 p-4"
              >
                <button
                  type="button"
                  className="text-left text-sm hover:underline"
                  onClick={() => setSelectedEmployeeId(employee.id)}
                >
                  <p className="font-medium text-foreground">{employee.fullName}</p>
                  <p className="text-muted-foreground">{employee.email}</p>
                </button>
                <div className="flex gap-2">
                  <form
                    action={approveEmployeeForm}
                    onSubmit={() => {
                      setTimeout(() => router.refresh(), 100);
                    }}
                  >
                    <input type="hidden" name="employeeId" value={employee.id} />
                    <Button type="submit" size="sm">
                      Approve
                    </Button>
                  </form>
                  <form
                    action={rejectEmployeeForm}
                    onSubmit={() => {
                      setTimeout(() => router.refresh(), 100);
                    }}
                  >
                    <input type="hidden" name="employeeId" value={employee.id} />
                    <Button type="submit" size="sm" variant="outline">
                      Decline
                    </Button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      <Modal
        open={selectedEmployee !== null}
        title="Employee registration"
        onClose={() => setSelectedEmployeeId(null)}
      >
        {selectedEmployee ? (
          <div className="space-y-4 text-sm">
            <dl className="space-y-2">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium">{selectedEmployee.fullName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd>{selectedEmployee.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Department</dt>
                <dd>{selectedEmployee.department}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd>{selectedEmployee.phone}</dd>
              </div>
            </dl>
            <hr className="border-border" />
            <div className="flex gap-2 pt-2">
              <form action={approveEmployeeForm}>
                <input type="hidden" name="employeeId" value={selectedEmployee.id} />
                <Button type="submit" size="sm">
                  Approve access
                </Button>
              </form>
              <form action={rejectEmployeeForm}>
                <input type="hidden" name="employeeId" value={selectedEmployee.id} />
                <Button type="submit" size="sm" variant="outline">
                  Decline
                </Button>
              </form>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
