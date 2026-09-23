import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { PageShell } from "@/components/layout/page-shell";
import { AuthHydrator } from "@/components/providers/auth-hydrator";
import { getEmployeeSessionOptional } from "@/lib/auth/guards";

export default async function EmployeePendingPage() {
  const employee = await getEmployeeSessionOptional();
  if (!employee) {
    redirect("/login");
  }
  if (employee.isApproved) {
    redirect("/employee");
  }

  return (
    <PageShell title="Awaiting admin approval">
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
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Hi {employee.fullName}, your account ({employee.email}) is waiting for an admin to
          approve it.
        </p>
        <div className="mt-6">
          <SignOutButton variant="outline" />
        </div>
      </div>
    </PageShell>
  );
}
