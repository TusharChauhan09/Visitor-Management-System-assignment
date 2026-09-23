import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { logout } from "@/app/actions/auth";
import { getEmployeeSessionOptional } from "@/lib/auth/guards";
import { Button } from "@/components/ui/button";

export default async function EmployeePendingPage() {
  const employee = await getEmployeeSessionOptional();
  if (!employee) {
    redirect("/employee/login");
  }
  if (employee.isApproved) {
    redirect("/employee");
  }

  return (
    <PageShell title="Awaiting admin approval">
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Hi {employee.fullName}, your account ({employee.email}) is waiting for an admin to
          approve it.
        </p>
        <form action={logout} className="mt-6">
          <Button type="submit" variant="outline">Sign out</Button>
        </form>
      </div>
    </PageShell>
  );
}
