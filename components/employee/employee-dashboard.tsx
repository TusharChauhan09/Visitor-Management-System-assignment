"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approvePendingVisit, denyPendingVisit } from "@/app/actions/employee";
import { logoutEmployee } from "@/app/actions/auth";
import type { VisitLogEntry } from "@/lib/types";
import { StatCards } from "@/components/dashboard/stat-cards";
import { StatusOverview } from "@/components/dashboard/status-overview";
import { DashboardFrame } from "@/components/dashboard/dashboard-frame";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { VisitLogTable } from "@/components/dashboard/visit-log-table";
import { VisitDetailPanel } from "@/components/dashboard/visit-detail-panel";
import { PreInviteForm } from "@/components/employee/pre-invite-form";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        defaultTab="overview"
        tabs={[
          {
            value: "overview",
            label: "Overview",
            badge: pendingVisits.length > 0 ? pendingVisits.length : undefined,
            content: (
              <div className="space-y-6 pb-4">
                <Card className="bg-card/80 shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Today&apos;s pre-invites</CardTitle>
                    <CardDescription>
                      {remainingToday} of {maxVisitorsPerDay} slots left for scheduled visitors.
                    </CardDescription>
                  </CardHeader>
                  {inviteUrl ? (
                    <CardContent>
                      <p className="text-xs text-muted-foreground">Latest check-in link</p>
                      <a
                        className="mt-1 block break-all text-sm font-medium text-primary underline-offset-4 hover:underline"
                        href={inviteUrl}
                      >
                        {inviteUrl}
                      </a>
                    </CardContent>
                  ) : null}
                </Card>
                <StatCards stats={stats} />
                <StatusOverview statusCounts={statusCounts} />
              </div>
            ),
          },
          {
            value: "invite",
            label: "Pre-invite",
            content: (
              <div className="pb-4">
                <PreInviteForm remainingToday={remainingToday} />
              </div>
            ),
          },
          {
            value: "visitors",
            label: "Visitor log",
            badge: visits.length,
            content: (
              <div className="space-y-3 pb-4">
                <p className="text-sm text-muted-foreground">Tap a row for visit details.</p>
                <VisitLogTable visits={visits} showHost={false} />
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
