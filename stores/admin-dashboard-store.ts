import { create } from "zustand";

type AdminDashboardState = {
  notifyOpen: boolean;
  selectedEmployeeId: string | null;
  openNotifications: () => void;
  closeNotifications: () => void;
  setSelectedEmployeeId: (id: string | null) => void;
  syncPendingEmployees: (pendingIds: string[], openIfAny: boolean) => void;
};

export const useAdminDashboardStore = create<AdminDashboardState>((set) => ({
  notifyOpen: false,
  selectedEmployeeId: null,
  openNotifications: () => set({ notifyOpen: true }),
  closeNotifications: () => set({ notifyOpen: false, selectedEmployeeId: null }),
  setSelectedEmployeeId: (selectedEmployeeId) => set({ selectedEmployeeId }),
  syncPendingEmployees: (pendingIds, openIfAny) =>
    set((state) => ({
      notifyOpen: openIfAny && pendingIds.length > 0 ? true : state.notifyOpen,
    })),
}));
