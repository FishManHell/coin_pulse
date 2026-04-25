import type { StateCreator } from "zustand";
import type { AppStore, StoreMutators } from "../types";

export type SelectionSlice = {
  selectedSymbol: string;
  selectedQuote: string;
  setSelectedSymbol: (symbol: string) => void;
  setSelectedQuote: (quote: string) => void;
};

export const createSelectionSlice: StateCreator<
  AppStore,
  StoreMutators,
  [],
  SelectionSlice
> = (set) => ({
  selectedSymbol: "BTCUSDT",
  selectedQuote: "USDT",

  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }, false, "selection/setSelectedSymbol"),
  setSelectedQuote: (quote) => set({ selectedQuote: quote }, false, "selection/setSelectedQuote"),
});
