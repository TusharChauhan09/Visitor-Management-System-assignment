import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { EmployeeAuthForm } from "@/components/employee/auth-form";
import { registerEmployee } from "@/app/actions/auth";

export default function EmployeeRegisterPage() {
  return (
    <PageShell title="Employee registration" backHref="/employee/login" backLabel="Sign in">
      <EmployeeAuthForm mode="register" action={registerEmployee} />
      <p className="mt-6 text-sm text-muted-foreground">
        Already registered?{" "}
        <Link href="/employee/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </PageShell>
  );
}
