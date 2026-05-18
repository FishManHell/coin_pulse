"use client";

import { useQuery } from "@tanstack/react-query";
import type { CoinMetaResponse } from "@/entities/coin";

const EMPTY: CoinMetaResponse = { names: {}, pairs: [] };

// Coin meta is stable reference data: server-cached 24h via unstable_cache,
// names/pairs change rarely. Match that semantics on the client so window
// focus doesn't trigger refetches of data we already know is fresh.
const STALE_TIME = 30 * 60 * 1000;

export const useCoinMeta = (quote: string): CoinMetaResponse => {
  const { data } = useQuery({
    queryKey: ["coin-meta", quote],
    queryFn: async (): Promise<CoinMetaResponse> => {
      const res = await fetch(`/api/coin-meta?quote=${quote}`);
      return res.json();
    },
    staleTime: STALE_TIME,
  });
  return data ?? EMPTY;
};
