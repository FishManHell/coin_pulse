"use client";

import { useEffect, useState } from "react";
import type { CoinMeta, CoinMetaResponse } from "@/shared/types";

export const usePairsForQuote = (quote: string) => {
  const [pairs, setPairs] = useState<CoinMeta[]>([]);

  useEffect(() => {
    let cancelled = false;
    setPairs([]);
    fetch(`/api/coin-meta?quote=${quote}`)
      .then((r) => r.json())
      .then((data: CoinMetaResponse) => {
        if (!cancelled) setPairs(data.pairs);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [quote]);

  return pairs;
};
