import type { StateCreator } from "zustand";
import type { CoinTicker } from "@/shared/types";
import type { AppStore, StoreMutators } from "../types";

export interface MarketSlice {
  prices: Record<string, CoinTicker>;
  updatePrice: (ticker: CoinTicker) => void;
}

export const createMarketSlice: StateCreator<
  AppStore,
  StoreMutators,
  [],
  MarketSlice
> = (set) => ({
  prices: {},

  updatePrice: (ticker) =>
    set(
      (state) => ({ prices: { ...state.prices, [ticker.symbol]: ticker } }),
      false,
      `market/updatePrice/${ticker.symbol}`,
    ),
});
