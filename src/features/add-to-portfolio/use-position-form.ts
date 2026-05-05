"use client";

import { useCallback, useEffect, useState, SubmitEvent } from "react";
import { useQuoteCurrencies } from "@/shared/hooks/useQuoteCurrencies";
import { usePairsForQuote } from "@/shared/hooks/usePairsForQuote";
import { useAddToPortfolio } from "./use-add-to-portfolio";

interface Fields {
  symbol: string;
  quantity: string;
  buyPrice: string;
}

const initialFields: Fields = { symbol: "", quantity: "", buyPrice: "" };
const DEFAULT_QUOTE = "USDT";

export const usePositionForm = ({ onSuccessAction }: { onSuccessAction: () => void }) => {
  const { add, loading, error } = useAddToPortfolio();
  const [fields, setFields] = useState<Fields>(initialFields);
  const [quote, setQuote] = useState<string>(DEFAULT_QUOTE);
  const quotes = useQuoteCurrencies();
  const pairs = usePairsForQuote(quote);

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
    if (pairs.length === 0) return;
    setFields((f) => {
      if (f.symbol && pairs.some((p) => p.symbol === f.symbol)) return f;
      return { ...f, symbol: pairs[0].symbol };
    });
  }, [pairs]);

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e: SubmitEvent<HTMLFormElement>) => {
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
      onSuccessAction();
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
