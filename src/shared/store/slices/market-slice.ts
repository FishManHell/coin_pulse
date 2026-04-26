import type { StateCreator } from "zustand";
import type { CoinTicker, CoinMeta, CoinMetaResponse } from "@/shared/types";
import type { AppStore, StoreMutators } from "../types";

export type MarketSlice = {
  prices: Record<string, CoinTicker>;
  coinNames: Record<string, string>;
  tradeablePairs: CoinMeta[];
  updatePrice: (ticker: CoinTicker) => void;
  setCoinMeta: (data: CoinMetaResponse) => void;
};

export const createMarketSlice: StateCreator<
  AppStore,
  StoreMutators,
  [],
  MarketSlice
> = (set) => ({
  prices: {},
  coinNames: {},
  tradeablePairs: [],

  updatePrice: (ticker) =>
    set(
      (state) => ({ prices: { ...state.prices, [ticker.symbol]: ticker } }),
      false,
      `market/updatePrice/${ticker.symbol}`,
    ),

  setCoinMeta: ({ names, pairs }) =>
    set({ coinNames: names, tradeablePairs: pairs }, false, "market/setCoinMeta"),
});
