import { create } from "zustand";

type EmployeeDashboardState = {
  notifyOpen: boolean;
  activePendingId: string | null;
  actionError: string;
  openNotifications: (firstPendingId: string | null) => void;
  closeNotifications: () => void;
  setActivePendingId: (id: string | null) => void;
  setActionError: (error: string) => void;
  syncPending: (pendingIds: string[], openIfAny: boolean) => void;
};

export const useEmployeeDashboardStore = create<EmployeeDashboardState>((set) => ({
  notifyOpen: false,
  activePendingId: null,
  actionError: "",
  openNotifications: (firstPendingId) =>
    set({ notifyOpen: true, activePendingId: firstPendingId }),
  closeNotifications: () => set({ notifyOpen: false }),
  setActivePendingId: (activePendingId) => set({ activePendingId }),
  setActionError: (actionError) => set({ actionError }),
  syncPending: (pendingIds, openIfAny) =>
    set((state) => ({
      activePendingId: state.activePendingId ?? pendingIds[0] ?? null,
      notifyOpen: openIfAny && pendingIds.length > 0 ? true : state.notifyOpen,
    })),
}));
