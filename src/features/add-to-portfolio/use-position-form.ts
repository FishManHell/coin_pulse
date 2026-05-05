"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppStore } from "@/shared/store";
import type { CoinMeta, CoinMetaResponse } from "@/shared/types";
import { useAddToPortfolio } from "./use-add-to-portfolio";

interface Fields {
  symbol: string;
  quantity: string;
  buyPrice: string;
}

const initialFields: Fields = { symbol: "", quantity: "", buyPrice: "" };

export const usePositionForm = ({ onSuccess }: { onSuccess: () => void }) => {
  // Form is decoupled from global selectedQuote — switching Pair here must not
  // ripple into the dashboard header or the global tradeablePairs list.
  const initialQuote = useAppStore.getState().selectedQuote;
  const { add, loading, error } = useAddToPortfolio();
  const [fields, setFields] = useState<Fields>(initialFields);
  const [quote, setQuote] = useState<string>(initialQuote);
  const [quotes, setQuotes] = useState<string[]>([initialQuote]);
  const [pairs, setPairs] = useState<CoinMeta[]>([]);

  useEffect(() => {
    fetch("/api/quote-currencies")
      .then((r) => r.json())
      .then((data: string[]) => {
        if (Array.isArray(data) && data.length) setQuotes(data);
      })
      .catch(() => {});
  }, []);

  // Update quote and remap the selected symbol in the same batch — otherwise
  // there's a render where quote changed but symbol still has the old suffix,
  // which leaks the full pair (e.g. "BTCUSDT") into the combobox input.
  const handleSetQuote = useCallback((newQuote: string) => {
    if (newQuote === quote) return;
    setFields((f) => {
      if (!f.symbol) return f;
      const base = f.symbol.endsWith(quote) ? f.symbol.slice(0, -quote.length) : f.symbol;
      return { ...f, symbol: `${base}${newQuote}` };
    });
    setQuote(newQuote);
  }, [quote]);

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

  // When new pairs arrive, keep current selection if still valid; otherwise
  // pick the first available pair.
  useEffect(() => {
    if (pairs.length === 0) return;
    setFields((f) => {
      if (f.symbol && pairs.some((p) => p.symbol === f.symbol)) return f;
      return { ...f, symbol: pairs[0].symbol };
    });
  }, [pairs]);

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const coin = pairs.find((c) => c.symbol === fields.symbol);
    if (!coin) return;
    const ok = await add({
      symbol: coin.symbol,
      name: coin.name,
      quote,
      quantity: Number(fields.quantity),
      buyPrice: Number(fields.buyPrice),
    });
    if (ok) {
      setFields(initialFields);
      onSuccess();
    }
  };

  return {
    fields,
    set,
    submit,
    loading,
    error,
    noPairs: pairs.length === 0,
    quote,
    setQuote: handleSetQuote,
    quotes,
    pairs,
  };
};
