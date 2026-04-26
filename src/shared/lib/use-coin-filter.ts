"use client";

import { useMemo } from "react";
import { useAppStore } from "@/shared/store";
import type { CoinMeta } from "@/shared/types";

type Options = {
  limit?: number;
  showAllOnEmpty?: boolean;
};

export const useCoinFilter = (query: string, options: Options = {}): CoinMeta[] => {
  const { limit, showAllOnEmpty = false } = options;
  const tradeablePairs = useAppStore((s) => s.tradeablePairs);

  return useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      const base = showAllOnEmpty ? tradeablePairs : [];
      return limit ? base.slice(0, limit) : base;
    }
    const filtered = tradeablePairs.filter(
      (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q),
    );
    return limit ? filtered.slice(0, limit) : filtered;
  }, [query, tradeablePairs, limit, showAllOnEmpty]);
};
