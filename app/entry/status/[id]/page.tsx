import Image from "next/image";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { VisitPassDisplay } from "@/components/visit/visit-pass-display";
import { prisma } from "@/lib/db/prisma";

const STATUS_COPY: Record<
  string,
  { title: string; body: string }
> = {
  PENDING: {
    title: "Waiting for host approval",
    body: "Your details are saved. The host was emailed a link to approve or deny. A QR pass appears here after approval.",
  },
  APPROVED: {
    title: "Approved",
    body: "You may enter. Present your QR pass at the desk if you have not checked in yet.",
  },
  REJECTED: {
    title: "Access denied",
    body: "The host declined this visit. Security will handle next steps at the desk.",
  },
  CHECKED_IN: {
    title: "Checked in",
    body: "Entry time is recorded. Return to the desk when you leave so checkout can be logged.",
  },
  CHECKED_OUT: {
    title: "Checked out",
    body: "This visit is closed.",
  },
  EXPIRED: {
    title: "Pass expired",
    body: "The approved window ended before check-in. Register again if you still need access.",
  },
  OVERSTAY: {
    title: "Visit flagged",
    body: "This visit is marked overstay. Speak with security.",
  },
};

function formatTime(value: Date | null) {
  if (!value) {
    return "Not recorded yet";
  }
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function VisitStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const visit = await prisma.visit.findUnique({
    where: { id },
    include: { visitor: true, host: true },
  });

  if (!visit) {
    notFound();
  }

  const copy = STATUS_COPY[visit.status] ?? STATUS_COPY.PENDING;

  return (
    <PageShell title={copy.title} description={copy.body}>
      <div className="space-y-6 rounded-xl border border-border bg-card p-4 sm:p-6">
        {visit.photoUrl ? (
          <div className="overflow-hidden rounded-xl border border-border">
            <Image
              src={visit.photoUrl}
              alt={`Photo of ${visit.visitor.fullName}`}
              width={640}
              height={480}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        ) : null}

        {visit.qrCode && (visit.status === "APPROVED" || visit.status === "CHECKED_IN") ? (
          <VisitPassDisplay qrCode={visit.qrCode} />
        ) : null}

        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="space-y-1">
            <dt className="text-muted-foreground">Visitor</dt>
            <dd className="font-medium">{visit.visitor.fullName}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-muted-foreground">Contact</dt>
            <dd className="font-medium">
              {visit.visitor.phone}
              <span className="mt-0.5 block font-normal text-muted-foreground">
                {visit.visitor.email}
              </span>
            </dd>
          </div>
          {visit.visitor.company ? (
            <div className="space-y-1">
              <dt className="text-muted-foreground">Company</dt>
              <dd className="font-medium">{visit.visitor.company}</dd>
            </div>
          ) : null}
          <div className="space-y-1">
            <dt className="text-muted-foreground">Purpose</dt>
            <dd className="font-medium">{visit.purpose}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-muted-foreground">Host</dt>
            <dd className="font-medium">
              {visit.host.fullName}
              <span className="mt-0.5 block font-normal text-muted-foreground">
                {visit.host.department}
              </span>
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-muted-foreground">Check-in</dt>
            <dd className="font-medium">{formatTime(visit.checkInAt)}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-muted-foreground">Check-out</dt>
            <dd className="font-medium">{formatTime(visit.checkOutAt)}</dd>
          </div>
        </dl>
      </div>
    </PageShell>
  );
}
