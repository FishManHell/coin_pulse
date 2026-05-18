"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSelectionStore } from "@/shared/store";
import { useStaleAfter } from "@/shared/hooks/useStaleAfter";
import { useEnsureValidSelection } from "./use-ensure-valid-selection";

export const useTopCoins = (initialSymbols: string[]) => {
  const selectedQuote = useSelectionStore((s) => s.selectedQuote);

  const { data: symbols, isFetching: fetching } = useQuery({
    queryKey: ["top-coins", selectedQuote],
    queryFn: async (): Promise<string[]> => {
      const res = await fetch(`/api/top-coins?quote=${selectedQuote}`);
      return res.json();
    },
    initialData: initialSymbols,
    placeholderData: keepPreviousData,
  });

  useEnsureValidSelection(symbols, selectedQuote);
  const timedOut = useStaleAfter(symbols, 10_000);

  return { symbols, fetching, timedOut };
};
