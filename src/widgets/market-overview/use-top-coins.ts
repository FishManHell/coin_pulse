"use client";

import { useEffect } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/shared/store";
import { useStaleAfter } from "@/shared/hooks/useStaleAfter";

export const useTopCoins = (initialSymbols: string[]) => {
  const selectedQuote = useAppStore((s) => s.selectedQuote);
  const setSelectedSymbol = useAppStore((s) => s.setSelectedSymbol);

  const { data: symbols, isFetching: fetching } = useQuery({
    queryKey: ["top-coins", selectedQuote],
    queryFn: async (): Promise<string[]> => {
      const res = await fetch(`/api/top-coins?quote=${selectedQuote}`);
      return res.json();
    },
    initialData: initialSymbols,
    placeholderData: keepPreviousData,
  });

  // Fallback only if QuoteSelector couldn't preserve the user's selection
  // (i.e. current symbol doesn't match the new quote).
  useEffect(() => {
    if (symbols.length === 0) return;
    const currentSymbol = useAppStore.getState().selectedSymbol;
    if (!currentSymbol.endsWith(selectedQuote)) {
      setSelectedSymbol(symbols[0]);
    }
  }, [symbols, selectedQuote, setSelectedSymbol]);

  const timedOut = useStaleAfter(symbols, 10_000);

  return { symbols, fetching, timedOut };
};
