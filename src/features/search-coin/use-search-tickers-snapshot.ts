"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/shared/store";
import { fetchTickersSnapshot } from "@/shared/api/binance";

export const useSearchTickersSnapshot = (symbols: string[]) => {
  const updatePrice = useAppStore((s) => s.updatePrice);
  const key = symbols.join(",");

  const { data } = useQuery({
    queryKey: ["search-tickers-snapshot", key],
    queryFn: () => fetchTickersSnapshot(symbols),
    enabled: symbols.length > 0,
    staleTime: 30_000,
    gcTime: 60_000,
  });

  useEffect(() => {
    if (!data) return;
    data.forEach(updatePrice);
  }, [data, updatePrice]);
};
