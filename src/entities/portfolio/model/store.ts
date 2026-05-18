import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { PortfolioPosition } from "../types";

interface PortfolioStore {
  positions: PortfolioPosition[];
  setPositions: (positions: PortfolioPosition[]) => void;
}

export const usePortfolioStore = create<PortfolioStore>()(
  devtools(
    (set) => ({
      positions: [],
      setPositions: (positions) => set({ positions }, false, "portfolio/setPositions"),
    }),
    { name: "coinpulse/portfolio", enabled: process.env.NODE_ENV !== "production" },
  ),
);
