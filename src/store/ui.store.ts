import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

/**
 * UI-only preferences. Persisted to localStorage so layout choices survive
 * reloads; never store auth/session data here.
 */
export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    }),
    { name: "myschoolpadi-ui" },
  ),
);
