import { PageShell } from "@/components/layout/page-shell";
import { approveEmployeeForm, rejectEmployeeForm } from "@/app/actions/admin";
import { logoutAdmin } from "@/app/actions/auth";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  await requireAdmin();

  const [pending, approved] = await Promise.all([
    prisma.employee.findMany({
      where: { isApproved: false },
      orderBy: { fullName: "asc" },
    }),
    prisma.employee.findMany({
      where: { isApproved: true },
      orderBy: { fullName: "asc" },
      take: 20,
    }),
  ]);

  return (
    <PageShell title="Admin — employee approvals">
      <form action={logoutAdmin} className="mb-8">
        <Button type="submit" variant="outline" size="sm">Sign out</Button>
      </form>

      <section className="space-y-4">
        <h2 className="text-base font-semibold">Pending registration</h2>
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">No employees waiting for approval.</p>
        ) : (
          <ul className="space-y-3">
            {pending.map((employee) => (
              <li
                key={employee.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4"
              >
                <div className="text-sm">
                  <p className="font-medium">{employee.fullName}</p>
                  <p className="text-muted-foreground">{employee.email}</p>
                  <p className="text-muted-foreground">{employee.department} · {employee.phone}</p>
                </div>
                <div className="flex gap-2">
                  <form action={approveEmployeeForm}>
                    <input type="hidden" name="employeeId" value={employee.id} />
                    <Button type="submit" size="sm">Approve</Button>
                  </form>
                  <form action={rejectEmployeeForm}>
                    <input type="hidden" name="employeeId" value={employee.id} />
                    <Button type="submit" size="sm" variant="outline">Reject</Button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-base font-semibold">Approved employees</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {approved.map((e) => (
            <li key={e.id}>
              {e.fullName} — {e.email} (max {e.maxVisitorsPerDay} pre-invites/day)
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
