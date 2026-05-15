"use client";

import { useEffect } from "react";
import { useAppStore } from "@/shared/store";

export const useEnsureValidSelection = (symbols: string[], quote: string): void => {
  const setSelectedSymbol = useAppStore((s) => s.setSelectedSymbol);

  useEffect(() => {
    if (symbols.length === 0) return;
    // Imperative store read — subscribing would re-run this effect on every
    // selectedSymbol change and immediately re-validate after our own set.
    const currentSymbol = useAppStore.getState().selectedSymbol;
    if (!currentSymbol.endsWith(quote)) {
      setSelectedSymbol(symbols[0]);
    }
  }, [symbols, quote, setSelectedSymbol]);
};
