"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/shared/store";

export const useTopCoins = (initialSymbols: string[]) => {
  const selectedQuote = useAppStore((s) => s.selectedQuote);
  const setSelectedSymbol = useAppStore((s) => s.setSelectedSymbol);

  const [symbols, setSymbols] = useState(initialSymbols);
  const [fetching, setFetching] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setFetching(true);
    fetch(`/api/top-coins?quote=${selectedQuote}`)
      .then((r) => r.json())
      .then((data: string[]) => {
        setSymbols(data);
        setFetching(false);

        // Fallback only if QuoteSelector couldn't preserve the user's selection
        // (i.e. current symbol doesn't match the new quote).
        const currentSymbol = useAppStore.getState().selectedSymbol;
        if (!currentSymbol.endsWith(selectedQuote) && data.length > 0) {
          setSelectedSymbol(data[0]);
        }
      });
  }, [selectedQuote]);

  useEffect(() => {
    setTimedOut(false);
    const t = setTimeout(() => setTimedOut(true), 10_000);
    return () => clearTimeout(t);
  }, [symbols]);

  return { symbols, fetching, timedOut };
};
