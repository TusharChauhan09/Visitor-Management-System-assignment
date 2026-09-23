import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { VisitPassDisplay } from "@/components/visit/visit-pass-display";
import { VisitStatusSuccess } from "@/components/visit/visit-status-success";
import { prisma } from "@/lib/db/prisma";
import {
  formatReapplyTime,
  isOnRejectionCooldown,
  rejectionCooldownEnds,
  statusLabel,
  STATUS_BADGE,
} from "@/lib/visits";
import { cn } from "@/lib/utils";

const STATUS_COPY: Record<string, { title: string; body: string }> = {
  PENDING: {
    title: "Waiting for host approval",
    body: "Your details are saved. The host was emailed a link to approve or deny. A QR pass appears here after approval.",
  },
  APPROVED: {
    title: "Approved",
    body: "Your host approved this visit. Use your pass below at the desk scanner when you arrive.",
  },
  REJECTED: {
    title: "Access denied",
    body: "The host declined this visit. Security will handle next steps at the desk.",
  },
  CHECKED_IN: {
    title: "Checked in",
    body: "",
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

  const showPass = Boolean(visit.qrCode) && visit.status === "APPROVED";
  const showEntrySuccess = visit.status === "CHECKED_IN";
  const copy = STATUS_COPY[visit.status] ?? STATUS_COPY.PENDING;
  const rejectionLocked =
    visit.status === "REJECTED" && isOnRejectionCooldown(visit.updatedAt);
  const description =
    rejectionLocked && copy.body
      ? `${copy.body} You cannot submit a new desk registration until ${formatReapplyTime(rejectionCooldownEnds(visit.updatedAt))}.`
      : copy.body;

  const shellTitle = showEntrySuccess ? undefined : copy.title;
  const shellDescription = showEntrySuccess ? undefined : description || undefined;
  const showStatusHeader = !showEntrySuccess;

  return (
    <PageShell title={shellTitle} description={shellDescription}>
      {showStatusHeader ? (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
              STATUS_BADGE[visit.status] ?? STATUS_BADGE.PENDING
            )}
          >
            {statusLabel(visit.status)}
          </span>
          <Link
            href="/entry/status"
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            Look up with another email
          </Link>
        </div>
      ) : null}

      <div className="space-y-6 rounded-xl border border-border bg-card p-4 sm:p-6">
        {showEntrySuccess ? (
          <VisitStatusSuccess
            badge="Approved"
            title="Entry successful"
            description={`Welcome, ${visit.visitor.fullName}. You checked in${visit.checkInAt ? ` at ${formatTime(visit.checkInAt)}` : ""}.`}
          />
        ) : null}

        {showPass ? <VisitPassDisplay qrCode={visit.qrCode!} /> : null}

        <section
          className={cn((showEntrySuccess || showPass) && "border-t border-border pt-6")}
        >
          <h3 className="text-sm font-semibold tracking-tight">Visitor details</h3>

          {visit.photoUrl ? (
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <Image
                src={visit.photoUrl}
                alt={`Photo of ${visit.visitor.fullName}`}
                width={640}
                height={480}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          ) : null}

          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
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
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-medium">{statusLabel(visit.status)}</dd>
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
        </section>
      </div>

      {showEntrySuccess ? (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          <Link href="/entry/status" className="font-medium text-primary underline-offset-4 hover:underline">
            Look up another visit
          </Link>
        </p>
      ) : null}
    </PageShell>
  );
}
