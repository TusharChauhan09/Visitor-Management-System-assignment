import { PageShell } from "@/components/layout/page-shell";
import { VisitStatusLookupForm } from "@/components/visit/visit-status-lookup-form";

export default function CheckVisitStatusPage() {
  return (
    <PageShell
      title="Check request status"
      description="Waiting for host approval or need your pass again? Look up your visit with the email you registered."
      center
    >
      <VisitStatusLookupForm />
    </PageShell>
  );
}
