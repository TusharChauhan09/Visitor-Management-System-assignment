import { LoginCard } from "@/components/auth/login-card";
import { PageShell } from "@/components/layout/page-shell";

export default function LoginPage() {
  return (
    <PageShell center hideBack>
      <LoginCard />
    </PageShell>
  );
}
