import { create } from "zustand";

type UserState = {
  currency: string;
  /** null while unknown (not synced yet, or the sync failed). */
  needsOnboarding: boolean | null;
  syncError: string | null;
  /** Bumped by retrySync() to run the sync again. */
  syncAttempt: number;
};

type UserActions = {
  setCurrency: (value: string) => void;
  setNeedsOnboarding: (value: boolean) => void;
  setSyncError: (message: string) => void;
  retrySync: () => void;
  reset: () => void;
};

const initialState: UserState = {
  currency: "USD",
  needsOnboarding: null,
  syncError: null,
  syncAttempt: 0,
};

export const useUserStore = create<UserState & UserActions>((set) => ({
  ...initialState,
  setCurrency: (currency) => set({ currency }),
  setNeedsOnboarding: (needsOnboarding) =>
    set({ needsOnboarding, syncError: null }),
  setSyncError: (syncError) => set({ syncError }),
  retrySync: () =>
    set((state) => ({ syncError: null, syncAttempt: state.syncAttempt + 1 })),
  reset: () => set(initialState),
}));
