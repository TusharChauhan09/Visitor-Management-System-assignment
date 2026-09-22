import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { EmployeeAuthForm } from "@/components/employee/auth-form";
import { loginEmployee } from "@/app/actions/auth";

export default function EmployeeLoginPage() {
  return (
    <PageShell title="Employee sign in" backHref="/" backLabel="Desk">
      <EmployeeAuthForm mode="login" action={loginEmployee} />
      <p className="mt-6 text-sm text-muted-foreground">
        New employee?{" "}
        <Link href="/employee/register" className="font-medium text-foreground underline-offset-4 hover:underline">
          Register
        </Link>
      </p>
    </PageShell>
  );
}
