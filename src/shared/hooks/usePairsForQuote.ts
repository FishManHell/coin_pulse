"use client";

import { useEffect, useState } from "react";
import type { CoinMeta, CoinMetaResponse } from "@/shared/types";

export const usePairsForQuote = (quote: string) => {
  const [pairs, setPairs] = useState<CoinMeta[]>([]);
  const [prevQuote, setPrevQuote] = useState(quote);

  if (prevQuote !== quote) {
    setPrevQuote(quote);
    setPairs([]);
  }

  useEffect(() => {
    let cancelled = false;
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
