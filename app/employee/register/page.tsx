import { PageShell } from "@/components/layout/page-shell";
import { EmployeeAuthForm } from "@/components/employee/auth-form";
import { registerEmployee } from "@/app/actions/auth";

export default function EmployeeRegisterPage() {
  return (
    <PageShell center hideBack>
      <EmployeeAuthForm action={registerEmployee} />
    </PageShell>
  );
}
