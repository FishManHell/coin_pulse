"use client";

import { useQuery } from "@tanstack/react-query";
import type { CoinMeta, CoinMetaResponse } from "@/shared/types";

export const usePairsForQuote = (quote: string): CoinMeta[] => {
  const { data } = useQuery({
    queryKey: ["coin-meta", quote],
    queryFn: async (): Promise<CoinMeta[]> => {
      const res = await fetch(`/api/coin-meta?quote=${quote}`);
      const json: CoinMetaResponse = await res.json();
      return json.pairs;
    },
  });
  return data ?? [];
};
