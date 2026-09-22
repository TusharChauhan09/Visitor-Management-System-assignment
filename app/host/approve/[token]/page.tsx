import Link from "next/link";
import { notFound } from "next/navigation";
import { HostDecisionForm } from "@/components/host/host-decision-form";
import { HostVisitSummary } from "@/components/host/host-visit-summary";
import { SiteHeader } from "@/components/layout/site-header";
import { getPendingVisitByApprovalToken } from "@/lib/visits/queries";

export default async function HostApprovePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const visit = await getPendingVisitByApprovalToken(token);

  if (!visit) {
    notFound();
  }

  if (visit.status !== "PENDING") {
    return (
      <div className="flex min-h-full flex-1 flex-col">
        <SiteHeader />
        <main className="mx-auto max-w-lg px-6 py-14">
          <h1 className="text-2xl font-semibold">Request already handled</h1>
          <p className="mt-2 text-muted-foreground">
            This visit is already {visit.status.toLowerCase().replace("_", " ")}.
          </p>
          <Link href={`/entry/status/${visit.id}`} className="mt-6 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline">
            View visit status
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-6 py-10 lg:px-12 lg:py-14">
        <h1 className="text-3xl font-semibold tracking-tight">Approve visitor?</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Confirm to allow entry and issue a QR pass for check-in.
        </p>
        <div className="mt-10">
          <HostVisitSummary
            visitorName={visit.visitor.fullName}
            visitorEmail={visit.visitor.email}
            visitorPhone={visit.visitor.phone}
            company={visit.visitor.company}
            purpose={visit.purpose}
            photoUrl={visit.photoUrl}
            hostName={visit.host.fullName}
            department={visit.host.department}
          />
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <HostDecisionForm token={token} action="approve" label="Confirm approval" />
          <Link
            href={`/host/deny/${token}`}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-6 text-sm font-medium hover:bg-muted"
          >
            Deny instead
          </Link>
        </div>
      </main>
    </div>
  );
}
