import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { CoinTicker } from "../types";

interface PricesStore {
  prices: Record<string, CoinTicker>;
  updatePrice: (ticker: CoinTicker) => void;
}

export const usePricesStore = create<PricesStore>()(
  devtools(
    (set) => ({
      prices: {},
      updatePrice: (ticker) =>
        set(
          (state) => ({ prices: { ...state.prices, [ticker.symbol]: ticker } }),
          false,
          `prices/update/${ticker.symbol}`,
        ),
    }),
    { name: "coinpulse/prices", enabled: process.env.NODE_ENV !== "production" },
  ),
);
