"use client";

import { useMemo } from "react";
import { useSelectionStore } from "@/shared/store";
import { useCoinMeta } from "@/shared/hooks/useCoinMeta";
import type { CoinMeta } from "@/entities/coin";

interface Options {
  limit?: number;
  showAllOnEmpty?: boolean;
}

export const useCoinFilter = (query: string, options: Options = {}): CoinMeta[] => {
  const { limit, showAllOnEmpty = false } = options;
  const selectedQuote = useSelectionStore((s) => s.selectedQuote);
  const { pairs } = useCoinMeta(selectedQuote);

  return useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      const base = showAllOnEmpty ? pairs : [];
      return limit ? base.slice(0, limit) : base;
    }
    const filtered = pairs.filter(
      (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q),
    );
    return limit ? filtered.slice(0, limit) : filtered;
  }, [query, pairs, limit, showAllOnEmpty]);
};
