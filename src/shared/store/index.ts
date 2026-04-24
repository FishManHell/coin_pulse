import { create } from "zustand";
import type { CoinTicker, WatchlistItem, PortfolioPosition } from "@/shared/types";

type PriceMap = Record<string, CoinTicker>;

type Theme = "dark" | "light";

type AppStore = {
  prices: PriceMap;
  watchlist: WatchlistItem[];
  portfolio: PortfolioPosition[];
  selectedSymbol: string;
  theme: Theme;
  updatePrice: (ticker: CoinTicker) => void;
  setWatchlist: (items: WatchlistItem[]) => void;
  setPortfolio: (positions: PortfolioPosition[]) => void;
  setSelectedSymbol: (symbol: string) => void;
  setTheme: (theme: Theme) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  prices: {},
  watchlist: [],
  portfolio: [],
  selectedSymbol: "BTCUSDT",
  theme: "dark",

  updatePrice: (ticker) =>
    set((state) => ({
      prices: { ...state.prices, [ticker.symbol]: ticker },
    })),

  setWatchlist: (items) => set({ watchlist: items }),
  setPortfolio: (positions) => set({ portfolio: positions }),
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
  setTheme: (theme) => set({ theme }),
}));
