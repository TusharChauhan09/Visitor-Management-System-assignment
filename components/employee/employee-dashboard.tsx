"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approvePendingVisit, denyPendingVisit } from "@/app/actions/employee";
import { logoutEmployee } from "@/app/actions/auth";
import type { VisitLogEntry } from "@/lib/types";
import { StatCards } from "@/components/dashboard/stat-cards";
import { DashboardFrame } from "@/components/dashboard/dashboard-frame";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { VisitLogTable } from "@/components/dashboard/visit-log-table";
import { VisitDetailPanel } from "@/components/dashboard/visit-detail-panel";
import { PreInviteForm } from "@/components/employee/pre-invite-form";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  function runVisitAction(visitId: string, action: "approve" | "deny") {
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

  const headerActions = (
    <>
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
    </>
  );

  return (
    <>
      <DashboardFrame
        title={employeeName}
        description={`${department} · ${email}`}
        actions={headerActions}
        defaultTab="visitors"
        tabs={[
          {
            value: "visitors",
            label: "Visits",
            badge: pendingVisits.length > 0 ? pendingVisits.length : visits.length,
            content: (
              <div className="flex min-h-0 flex-1 flex-col gap-3">
                <StatCards
                  stats={[
                    ...stats,
                    { label: "Invites left today", value: remainingToday, hint: `${maxVisitorsPerDay} daily` },
                  ]}
                />
                {inviteUrl ? (
                  <p className="shrink-0 truncate text-xs text-muted-foreground">
                    Latest pass:{" "}
                    <a className="font-medium text-primary underline-offset-4 hover:underline" href={inviteUrl}>
                      {inviteUrl}
                    </a>
                  </p>
                ) : null}
                <VisitLogTable visits={visits} showHost={false} />
              </div>
            ),
          },
          {
            value: "invite",
            label: "Pre-invite",
            content: (
              <div className="min-h-0 flex-1 overflow-auto">
                <PreInviteForm remainingToday={remainingToday} />
              </div>
            ),
          },
        ]}
      />

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
            <div className="flex flex-wrap gap-2">
              {pendingVisits.map((visit) => (
                <button
                  key={visit.id}
                  type="button"
                  onClick={() => setActivePending(visit)}
                >
                  <Badge
                    variant={activePending?.id === visit.id ? "default" : "secondary"}
                    className="cursor-pointer px-3 py-1 text-xs"
                  >
                    {visit.visitor.fullName}
                  </Badge>
                </button>
              ))}
            </div>
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
    </>
  );
}
