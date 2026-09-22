"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveEmployeeForm, rejectEmployeeForm } from "@/app/actions/admin";
import { logoutAdmin } from "@/app/actions/auth";
import { EmployeeDirectory } from "@/components/admin/employee-directory";
import type { AdminEmployeeEntry, PendingEmployeeEntry, VisitLogEntry } from "@/lib/types";
import { StatCards } from "@/components/dashboard/stat-cards";
import { StatusOverview } from "@/components/dashboard/status-overview";
import { DashboardFrame } from "@/components/dashboard/dashboard-frame";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { VisitLogTable } from "@/components/dashboard/visit-log-table";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type AdminDashboardProps = {
  visits: VisitLogEntry[];
  employees: AdminEmployeeEntry[];
  pendingEmployees: PendingEmployeeEntry[];
  statusCounts: Record<string, number>;
};

export function AdminDashboard({
  visits,
  employees,
  pendingEmployees,
  statusCounts,
}: AdminDashboardProps) {
  const router = useRouter();
  const [notifyOpen, setNotifyOpen] = useState(pendingEmployees.length > 0);
  const [selectedEmployee, setSelectedEmployee] = useState<PendingEmployeeEntry | null>(
    null
  );

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
        onClick={() => setNotifyOpen(true)}
      />
      <form action={logoutAdmin}>
        <Button type="submit" variant="outline" size="sm">Sign out</Button>
      </form>
    </>
  );

  return (
    <>
      <DashboardFrame
        title="Admin dashboard"
        description="Visitor logs, host directory, and access requests in one place."
        actions={headerActions}
        defaultTab="overview"
        tabs={[
          {
            value: "overview",
            label: "Overview",
            content: (
              <div className="space-y-6 pb-4">
                <StatCards stats={stats} />
                <StatusOverview statusCounts={statusCounts} />
              </div>
            ),
          },
          {
            value: "visitors",
            label: "Visitor logs",
            badge: visits.length,
            content: (
              <div className="space-y-3 pb-4">
                <p className="text-sm text-muted-foreground">
                  Select a row to open full visitor and host details.
                </p>
                <VisitLogTable visits={visits} showHost />
              </div>
            ),
          },
          {
            value: "employees",
            label: "Employees",
            badge: employees.length,
            content: (
              <div className="space-y-3 pb-4">
                <p className="text-sm text-muted-foreground">
                  Registered hosts. Pending accounts need your approval.
                </p>
                <EmployeeDirectory employees={employees} />
              </div>
            ),
          },
        ]}
      />

      <Modal
        open={notifyOpen}
        title="Employee access requests"
        onClose={() => {
          setNotifyOpen(false);
          setSelectedEmployee(null);
        }}
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
                  onClick={() => setSelectedEmployee(employee)}
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
                    <Button type="submit" size="sm">Approve</Button>
                  </form>
                  <form
                    action={rejectEmployeeForm}
                    onSubmit={() => {
                      setTimeout(() => router.refresh(), 100);
                    }}
                  >
                    <input type="hidden" name="employeeId" value={employee.id} />
                    <Button type="submit" size="sm" variant="outline">Decline</Button>
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
        onClose={() => setSelectedEmployee(null)}
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
            <Separator />
            <div className="flex gap-2 pt-2">
              <form action={approveEmployeeForm}>
                <input type="hidden" name="employeeId" value={selectedEmployee.id} />
                <Button type="submit" size="sm">Approve access</Button>
              </form>
              <form action={rejectEmployeeForm}>
                <input type="hidden" name="employeeId" value={selectedEmployee.id} />
                <Button type="submit" size="sm" variant="outline">Decline</Button>
              </form>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
