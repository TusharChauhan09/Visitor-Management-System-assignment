"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveEmployeeForm, rejectEmployeeForm } from "@/app/actions/admin";
import type { AdminEmployeeEntry } from "@/lib/types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export function EmployeeDirectory({ employees }: { employees: AdminEmployeeEntry[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<AdminEmployeeEntry | null>(null);

  if (employees.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No employees registered yet.</p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Employee</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Access</th>
              <th className="px-4 py-3 font-medium">Visits</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="cursor-pointer border-b border-border/70 transition-colors last:border-0 hover:bg-muted/30"
                onClick={() => setSelected(employee)}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{employee.fullName}</p>
                  <p className="text-xs text-muted-foreground">{employee.email}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{employee.department}</td>
                <td className="px-4 py-3 text-muted-foreground">{employee.phone}</td>
                <td className="px-4 py-3">
                  <AccessBadge approved={employee.isApproved} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {employee.totalVisits} total
                  {employee.pendingVisits > 0 ? (
                    <span className="block text-xs text-amber-700 dark:text-amber-300">
                      {employee.pendingVisits} pending visitor
                      {employee.pendingVisits === 1 ? "" : "s"}
                    </span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={selected !== null}
        title="Employee details"
        wide
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <div className="space-y-6 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <AccessBadge approved={selected.isApproved} />
              {!selected.isApproved ? (
                <span className="text-xs text-muted-foreground">Awaiting admin approval</span>
              ) : null}
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Full name</dt>
                <dd className="font-medium text-foreground">{selected.fullName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Department</dt>
                <dd>{selected.department}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd>{selected.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd>{selected.phone}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Daily pre-invite limit</dt>
                <dd>{selected.maxVisitorsPerDay}</dd>
              </div>
            </dl>

            <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
              <Stat label="Total visits hosted" value={selected.totalVisits} />
              <Stat label="Pending visitor requests" value={selected.pendingVisits} />
              <Stat label="Currently checked in" value={selected.checkedInVisits} />
            </div>

            {!selected.isApproved ? (
              <div className="flex gap-2 border-t border-border pt-4">
                <form
                  action={approveEmployeeForm}
                  onSubmit={() => {
                    setTimeout(() => {
                      setSelected(null);
                      router.refresh();
                    }, 100);
                  }}
                >
                  <input type="hidden" name="employeeId" value={selected.id} />
                  <Button type="submit" size="sm">Approve employee</Button>
                </form>
                <form
                  action={rejectEmployeeForm}
                  onSubmit={() => {
                    setTimeout(() => {
                      setSelected(null);
                      router.refresh();
                    }, 100);
                  }}
                >
                  <input type="hidden" name="employeeId" value={selected.id} />
                  <Button type="submit" size="sm" variant="outline">Remove registration</Button>
                </form>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </>
  );
}

function AccessBadge({ approved }: { approved: boolean }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        approved
          ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200"
          : "bg-amber-500/15 text-amber-800 dark:text-amber-200"
      }`}
    >
      {approved ? "Approved" : "Pending"}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}
