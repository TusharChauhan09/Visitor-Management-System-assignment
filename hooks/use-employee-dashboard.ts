"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { approvePendingVisit, denyPendingVisit } from "@/app/actions/employee";
import type { VisitRow } from "@/lib/visits";
import { useEmployeeDashboardStore } from "@/stores/employee-dashboard-store";

export function useEmployeeDashboard(pendingVisits: VisitRow[]) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const notifyOpen = useEmployeeDashboardStore((state) => state.notifyOpen);
  const activePendingId = useEmployeeDashboardStore((state) => state.activePendingId);
  const actionError = useEmployeeDashboardStore((state) => state.actionError);
  const openNotifications = useEmployeeDashboardStore((state) => state.openNotifications);
  const closeNotifications = useEmployeeDashboardStore((state) => state.closeNotifications);
  const setActivePendingId = useEmployeeDashboardStore((state) => state.setActivePendingId);
  const setActionError = useEmployeeDashboardStore((state) => state.setActionError);
  const syncPending = useEmployeeDashboardStore((state) => state.syncPending);

  useEffect(() => {
    syncPending(
      pendingVisits.map((visit) => visit.id),
      pendingVisits.length > 0
    );
  }, [pendingVisits, syncPending]);

  const activePending =
    pendingVisits.find((visit) => visit.id === activePendingId) ?? pendingVisits[0] ?? null;

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
      closeNotifications();
      setActivePendingId(null);
      router.refresh();
    });
  }

  return {
    notifyOpen,
    activePending,
    actionError,
    pending,
    openNotifications,
    closeNotifications,
    setActivePendingId,
    runVisitAction,
  };
}
