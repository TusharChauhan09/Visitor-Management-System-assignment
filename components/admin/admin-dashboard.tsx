"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveEmployeeForm, rejectEmployeeForm } from "@/app/actions/admin";
import { logoutAdmin } from "@/app/actions/auth";
import { EmployeeDirectory } from "@/components/admin/employee-directory";
import type { AdminEmployeeEntry, PendingEmployeeEntry, VisitLogEntry } from "@/lib/types";
import { visitStatusLabel } from "@/lib/visits/status";
import { StatCards } from "@/components/dashboard/stat-cards";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { VisitLogTable } from "@/components/dashboard/visit-log-table";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visitor logs, statuses, and employee access requests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell
            count={pendingEmployees.length}
            label="Employee access requests"
            onClick={() => setNotifyOpen(true)}
          />
          <form action={logoutAdmin}>
            <Button type="submit" variant="outline" size="sm">Sign out</Button>
          </form>
        </div>
      </div>

      <StatCards stats={stats} />

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Status overview</h2>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {Object.entries(statusCounts).map(([status, count]) => (
            <span key={status} className="rounded-lg border border-border px-3 py-1.5">
              {visitStatusLabel(status)}: <strong className="text-foreground">{count}</strong>
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Employees</h2>
        <p className="text-sm text-muted-foreground">
          All registered hosts. Click a row for full profile and visit stats.
        </p>
        <EmployeeDirectory employees={employees} />
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Visitor logs</h2>
        <p className="text-sm text-muted-foreground">Click a row for full visitor and host details.</p>
        <VisitLogTable visits={visits} showHost />
      </section>

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
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4"
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
    </div>
  );
}
