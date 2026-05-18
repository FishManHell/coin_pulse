import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface SelectionStore {
  selectedSymbol: string;
  selectedQuote: string;
  setSelectedSymbol: (symbol: string) => void;
  setSelectedQuote: (quote: string) => void;
}

export const useSelectionStore = create<SelectionStore>()(
  devtools(
    (set) => ({
      selectedSymbol: "BTCUSDT",
      selectedQuote: "USDT",
      setSelectedSymbol: (symbol) =>
        set({ selectedSymbol: symbol }, false, "selection/setSelectedSymbol"),
      setSelectedQuote: (quote) =>
        set({ selectedQuote: quote }, false, "selection/setSelectedQuote"),
    }),
    { name: "coinpulse/selection", enabled: process.env.NODE_ENV !== "production" },
  ),
);
