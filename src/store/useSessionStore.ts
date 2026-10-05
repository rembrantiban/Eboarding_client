import { create } from "zustand";

interface SessionState {
  expired: boolean;
  showExpired: () => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  expired: false,
  showExpired: () => set({ expired: true }),
  reset: () => set({ expired: false }),
}));

// Reads the `exp` claim (seconds) from a JWT and returns it in ms, or null if unreadable.
export const getTokenExpiry = (token: string): number | null => {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(json);
    return typeof exp === "number" ? exp * 1000 : null;
  } catch {
    return null;
  }
};
