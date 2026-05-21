import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface MobileNavStore {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  close: () => void;
}

export const useMobileNavStore = create<MobileNavStore>()(
  devtools(
    (set) => ({
      open: false,
      setOpen: (open) => set({ open }, false, "mobileNav/setOpen"),
      toggle: () =>
        set((s) => ({ open: !s.open }), false, "mobileNav/toggle"),
      close: () => set({ open: false }, false, "mobileNav/close"),
    }),
    { name: "coinpulse/mobileNav", enabled: process.env.NODE_ENV !== "production" },
  ),
);
