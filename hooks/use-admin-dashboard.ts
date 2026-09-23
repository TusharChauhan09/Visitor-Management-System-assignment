"use client";

import { useEffect } from "react";
import type { Host } from "@/components/admin/employee-directory";
import { useAdminDashboardStore } from "@/stores/admin-dashboard-store";

export function useAdminDashboard(pendingEmployees: Host[]) {
  const notifyOpen = useAdminDashboardStore((state) => state.notifyOpen);
  const selectedEmployeeId = useAdminDashboardStore((state) => state.selectedEmployeeId);
  const openNotifications = useAdminDashboardStore((state) => state.openNotifications);
  const closeNotifications = useAdminDashboardStore((state) => state.closeNotifications);
  const setSelectedEmployeeId = useAdminDashboardStore((state) => state.setSelectedEmployeeId);
  const syncPendingEmployees = useAdminDashboardStore((state) => state.syncPendingEmployees);

  useEffect(() => {
    syncPendingEmployees(
      pendingEmployees.map((employee) => employee.id),
      pendingEmployees.length > 0
    );
  }, [pendingEmployees, syncPendingEmployees]);

  const selectedEmployee =
    pendingEmployees.find((employee) => employee.id === selectedEmployeeId) ?? null;

  return {
    notifyOpen,
    selectedEmployee,
    openNotifications,
    closeNotifications,
    setSelectedEmployeeId,
  };
}
