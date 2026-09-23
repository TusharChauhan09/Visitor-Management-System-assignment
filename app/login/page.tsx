import { LoginCard } from "@/components/auth/login-card";
import { AuthHydrator } from "@/components/providers/auth-hydrator";
import { PageShell } from "@/components/layout/page-shell";

export default function LoginPage() {
  return (
    <PageShell center hideBack>
      <AuthHydrator user={null} />
      <LoginCard />
    </PageShell>
  );
}
