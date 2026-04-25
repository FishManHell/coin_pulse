import type { StateCreator } from "zustand";
import type { CoinTicker } from "@/shared/types";
import type { AppStore, StoreMutators } from "../types";

export type MarketSlice = {
  prices: Record<string, CoinTicker>;
  coinNames: Record<string, string>;
  updatePrice: (ticker: CoinTicker) => void;
  setCoinNames: (names: Record<string, string>) => void;
};

export const createMarketSlice: StateCreator<
  AppStore,
  StoreMutators,
  [],
  MarketSlice
> = (set) => ({
  prices: {},
  coinNames: {},

  updatePrice: (ticker) =>
    set(
      (state) => ({ prices: { ...state.prices, [ticker.symbol]: ticker } }),
      false,
      `market/updatePrice/${ticker.symbol}`,
    ),

  setCoinNames: (names) => set({ coinNames: names }, false, "market/setCoinNames"),
});
