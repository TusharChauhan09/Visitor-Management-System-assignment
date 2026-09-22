"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approvePendingVisit, denyPendingVisit } from "@/app/actions/employee";
import { logoutEmployee } from "@/app/actions/auth";
import type { VisitLogEntry } from "@/lib/types";
import { StatCards } from "@/components/dashboard/stat-cards";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { VisitLogTable } from "@/components/dashboard/visit-log-table";
import { VisitDetailPanel } from "@/components/dashboard/visit-detail-panel";
import { PreInviteForm } from "@/components/employee/pre-invite-form";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

type EmployeeDashboardProps = {
  employeeName: string;
  department: string;
  email: string;
  maxVisitorsPerDay: number;
  remainingToday: number;
  inviteUrl: string | null;
  visits: VisitLogEntry[];
  pendingVisits: VisitLogEntry[];
  statusCounts: Record<string, number>;
};

export function EmployeeDashboard({
  employeeName,
  department,
  email,
  maxVisitorsPerDay,
  remainingToday,
  inviteUrl,
  visits,
  pendingVisits,
  statusCounts,
}: EmployeeDashboardProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [notifyOpen, setNotifyOpen] = useState(pendingVisits.length > 0);
  const [activePending, setActivePending] = useState<VisitLogEntry | null>(
    pendingVisits[0] ?? null
  );
  const [actionError, setActionError] = useState("");

  const stats = [
    { label: "Your visitors", value: visits.length },
    { label: "Awaiting your OK", value: pendingVisits.length },
    { label: "Approved", value: statusCounts.APPROVED ?? 0 },
    { label: "Checked in", value: statusCounts.CHECKED_IN ?? 0 },
  ];

  function runVisitAction(
    visitId: string,
    action: "approve" | "deny"
  ) {
    setActionError("");
    startTransition(async () => {
      const result =
        action === "approve"
          ? await approvePendingVisit(visitId)
          : await denyPendingVisit(visitId);
      if (result.error) {
        setActionError(result.error);
        return;
      }
      setNotifyOpen(false);
      setActivePending(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          <p className="text-lg font-semibold text-foreground">{employeeName}</p>
          <p>{department} · {email}</p>
          <p className="mt-1">Daily pre-invite limit: {maxVisitorsPerDay}</p>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell
            count={pendingVisits.length}
            label="Visitor approval requests"
            onClick={() => {
              setActivePending(pendingVisits[0] ?? null);
              setNotifyOpen(true);
            }}
          />
          <form action={logoutEmployee}>
            <Button type="submit" variant="outline" size="sm">Sign out</Button>
          </form>
        </div>
      </div>

      {inviteUrl ? (
        <p className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
          Pre-invite link:{" "}
          <a className="break-all font-medium text-foreground underline" href={inviteUrl}>
            {inviteUrl}
          </a>
        </p>
      ) : null}

      <StatCards stats={stats} />

      <PreInviteForm remainingToday={remainingToday} />

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Visitor log</h2>
        <p className="text-sm text-muted-foreground">Click a row for details.</p>
        <VisitLogTable visits={visits} showHost={false} />
      </section>

      <Modal
        open={notifyOpen}
        title="Visitor approval requests"
        wide
        onClose={() => setNotifyOpen(false)}
      >
        {pendingVisits.length === 0 ? (
          <p className="text-sm text-muted-foreground">No visitors waiting for your approval.</p>
        ) : (
          <div className="space-y-4">
            {actionError ? (
              <p className="text-sm text-destructive">{actionError}</p>
            ) : null}
            <ul className="flex flex-wrap gap-2">
              {pendingVisits.map((visit) => (
                <li key={visit.id}>
                  <button
                    type="button"
                    onClick={() => setActivePending(visit)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      activePending?.id === visit.id
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {visit.visitor.fullName}
                  </button>
                </li>
              ))}
            </ul>
            {activePending ? (
              <>
                <VisitDetailPanel visit={activePending} />
                <div className="flex gap-2 border-t border-border pt-4">
                  <Button
                    type="button"
                    size="sm"
                    disabled={pending}
                    onClick={() => runVisitAction(activePending.id, "approve")}
                  >
                    Approve visit
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={pending}
                    onClick={() => runVisitAction(activePending.id, "deny")}
                  >
                    Deny visit
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        )}
      </Modal>
    </div>
  );
}
