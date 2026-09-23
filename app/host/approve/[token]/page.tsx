import Link from "next/link";
import { notFound } from "next/navigation";
import { HostDecisionForm } from "@/components/host/host-decision-form";
import { HostVisitSummary } from "@/components/host/host-visit-summary";
import { PageShell } from "@/components/layout/page-shell";
import { prisma } from "@/lib/db/prisma";

export default async function HostApprovePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const visit = await prisma.visit.findUnique({
    where: { approvalToken: token },
    include: { visitor: true, host: true },
  });

  if (!visit) {
    notFound();
  }

  if (visit.status !== "PENDING") {
    return (
      <PageShell title="Request already handled">
        <p className="text-muted-foreground">
          This visit is already {visit.status.toLowerCase().replace("_", " ")}.
        </p>
        <Link href={`/entry/status/${visit.id}`} className="mt-6 inline-block text-sm font-medium underline-offset-4 hover:underline">
          View visit status
        </Link>
      </PageShell>
    );
  }

  return (
    <PageShell title="Approve visitor?" description="Confirm to allow entry and issue a QR pass for check-in.">
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
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <HostDecisionForm token={token} action="approve" label="Confirm approval" />
        <Link
          href={`/host/deny/${token}`}
          className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-6 text-sm font-medium hover:bg-muted"
        >
          Deny instead
        </Link>
      </div>
    </PageShell>
  );
}
