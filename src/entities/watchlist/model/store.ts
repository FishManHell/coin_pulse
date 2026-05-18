import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { WatchlistItem } from "../types";

interface WatchlistStore {
  items: WatchlistItem[];
  setItems: (items: WatchlistItem[]) => void;
}

export const useWatchlistStore = create<WatchlistStore>()(
  devtools(
    (set) => ({
      items: [],
      setItems: (items) => set({ items }, false, "watchlist/setItems"),
    }),
    { name: "coinpulse/watchlist", enabled: process.env.NODE_ENV !== "production" },
  ),
);
