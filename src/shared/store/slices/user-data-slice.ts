import type { StateCreator } from "zustand";
import type { WatchlistItem, PortfolioPosition } from "@/shared/types";
import type { AppStore, StoreMutators } from "../types";

export type UserDataSlice = {
  watchlist: WatchlistItem[];
  portfolio: PortfolioPosition[];
  setWatchlist: (items: WatchlistItem[]) => void;
  setPortfolio: (positions: PortfolioPosition[]) => void;
};

export const createUserDataSlice: StateCreator<
  AppStore,
  StoreMutators,
  [],
  UserDataSlice
> = (set) => ({
  watchlist: [],
  portfolio: [],

  setWatchlist: (items) => set({ watchlist: items }, false, "userData/setWatchlist"),
  setPortfolio: (positions) => set({ portfolio: positions }, false, "userData/setPortfolio"),
});
