"use client";

import Link from "next/link";
import type { VisitRow } from "@/lib/visits";
import { StatCards } from "@/components/dashboard/stat-cards";
import { DashboardFrame } from "@/components/dashboard/dashboard-frame";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { VisitLogTable } from "@/components/dashboard/visit-log-table";
import { VisitDetailPanel } from "@/components/dashboard/visit-detail-panel";
import { PreInviteForm } from "@/components/employee/pre-invite-form";
import { ProfilePhoto } from "@/components/employee/profile-photo";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { VisitPassDisplay } from "@/components/visit/visit-pass-display";
import { useEmployeeDashboard } from "@/hooks/use-employee-dashboard";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type InvitePass = {
  visitorName: string;
  qrCode: string;
  checkInUrl: string;
  statusUrl: string;
};

type EmployeeDashboardProps = {
  employeeName: string;
  photoUrl: string | null;
  department: string;
  email: string;
  maxVisitorsPerDay: number;
  remainingToday: number;
  invitePass: InvitePass | null;
  defaultTab?: string;
  visits: VisitRow[];
  pendingVisits: VisitRow[];
  statusCounts: Record<string, number>;
};

export function EmployeeDashboard({
  employeeName,
  photoUrl,
  department,
  email,
  maxVisitorsPerDay,
  remainingToday,
  invitePass,
  defaultTab,
  visits,
  pendingVisits,
  statusCounts,
}: EmployeeDashboardProps) {
  const {
    notifyOpen,
    activePending,
    actionError,
    pending,
    openNotifications,
    closeNotifications,
    setActivePendingId,
    runVisitAction,
  } = useEmployeeDashboard(pendingVisits);

  const stats = [
    { label: "Your visitors", value: visits.length },
    { label: "Awaiting your OK", value: pendingVisits.length },
    { label: "Approved", value: statusCounts.APPROVED ?? 0 },
    { label: "Checked in", value: statusCounts.CHECKED_IN ?? 0 },
  ];

  const headerActions = (
    <>
      <NotificationBell
        count={pendingVisits.length}
        label="Visitor approval requests"
        onClick={() => {
          openNotifications(pendingVisits[0]?.id ?? null);
        }}
      />
      <SignOutButton />
    </>
  );

  return (
    <>
      <DashboardFrame
        title={employeeName}
        description={`${department} · ${email}`}
        leading={<ProfilePhoto name={employeeName} photoUrl={photoUrl} />}
        actions={headerActions}
        defaultTab={defaultTab ?? "visitors"}
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
                <VisitLogTable visits={visits} showHost={false} />
              </div>
            ),
          },
          {
            value: "invite",
            label: "Pre-invite",
            content: (
              <div className="min-h-0 flex-1 space-y-5 overflow-auto">
                {invitePass ? (
                  <div className="mx-auto w-full max-w-lg space-y-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Pass created</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Share this with <span className="font-medium text-foreground">{invitePass.visitorName}</span>{" "}
                        for their visit window.
                      </p>
                    </div>
                    <VisitPassDisplay qrCode={invitePass.qrCode} />
                    <p className="text-xs text-muted-foreground">
                      Visitor can also{" "}
                      <Link href="/entry/status" className="font-medium text-primary underline-offset-4 hover:underline">
                        check status
                      </Link>{" "}
                      with their email or open{" "}
                      <Link href={invitePass.statusUrl} className="font-medium text-primary underline-offset-4 hover:underline">
                        this visit page
                      </Link>
                      .
                    </p>
                  </div>
                ) : null}
                <div className="mx-auto w-full max-w-2xl">
                  <PreInviteForm remainingToday={remainingToday} />
                </div>
              </div>
            ),
          },
        ]}
      />

      <Modal
        open={notifyOpen}
        title="Visitor approval requests"
        wide
        onClose={closeNotifications}
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
                  onClick={() => setActivePendingId(visit.id)}
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
