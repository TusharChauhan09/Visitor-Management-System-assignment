import Image from "next/image";
import type { VisitRow } from "@/lib/visits";
import { STATUS_BADGE, statusLabel } from "@/lib/visits";
import { formatWindow } from "@/lib/visits";

function formatWhen(iso: string | null) {
  if (!iso) {
    return "—";
  }
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function VisitDetailPanel({ visit }: { visit: VisitRow }) {
  const badge = STATUS_BADGE[visit.status] ?? "bg-muted text-foreground";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge}`}>
          {statusLabel(visit.status)}
        </span>
        {visit.preApproved ? (
          <span className="text-xs text-muted-foreground">Pre-invited visit</span>
        ) : (
          <span className="text-xs text-muted-foreground">Walk-in registration</span>
        )}
      </div>

      {visit.photoUrl ? (
        <div className="overflow-hidden rounded-lg border border-border">
          <Image
            src={visit.photoUrl}
            alt={`Photo of ${visit.visitor.fullName}`}
            width={640}
            height={360}
            className="aspect-[16/10] w-full object-cover"
          />
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Visitor</h3>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium">{visit.visitor.fullName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd>{visit.visitor.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd>{visit.visitor.phone}</dd>
            </div>
            {visit.visitor.company ? (
              <div>
                <dt className="text-muted-foreground">Company</dt>
                <dd>{visit.visitor.company}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Host</h3>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium">{visit.host.fullName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Department</dt>
              <dd>{visit.host.department}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd>{visit.host.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd>{visit.host.phone}</dd>
            </div>
          </dl>
        </section>
      </div>

      <dl className="grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Purpose</dt>
          <dd className="font-medium">{visit.purpose}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Visit window</dt>
          <dd>
            {formatWindow(
              visit.windowStart ? new Date(visit.windowStart) : null,
              visit.windowEnd ? new Date(visit.windowEnd) : null
            )}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Registered</dt>
          <dd>{formatWhen(visit.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Check-in</dt>
          <dd>{formatWhen(visit.checkInAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Check-out</dt>
          <dd>{formatWhen(visit.checkOutAt)}</dd>
        </div>
      </dl>
    </div>
  );
}
