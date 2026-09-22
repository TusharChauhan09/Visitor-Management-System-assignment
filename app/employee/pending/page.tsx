import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { logoutEmployee } from "@/app/actions/auth";
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
      <p className="text-sm leading-relaxed text-muted-foreground">
        Hi {employee.fullName}, your account ({employee.email}) is waiting for an admin to
        approve it.
      </p>
      <form action={logoutEmployee} className="mt-8">
        <Button type="submit" variant="outline">Sign out</Button>
      </form>
    </PageShell>
  );
}
