import { create } from "zustand";

export type AuthUser =
  | {
      role: "admin";
      id: string;
      email: string;
    }
  | {
      role: "employee";
      id: string;
      email: string;
      fullName: string;
      department: string;
      isApproved: boolean;
    };

type LoginRole = "employee" | "admin";

type AuthState = {
  user: AuthUser | null;
  loginRole: LoginRole;
  setUser: (user: AuthUser | null) => void;
  clear: () => void;
  setLoginRole: (role: LoginRole) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loginRole: "employee",
  setUser: (user) => set({ user }),
  clear: () => set({ user: null }),
  setLoginRole: (loginRole) => set({ loginRole }),
}));
