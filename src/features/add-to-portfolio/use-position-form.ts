"use client";

import { useCallback, useState, SubmitEvent } from "react";
import { useQuoteCurrencies } from "@/shared/hooks/useQuoteCurrencies";
import { useCoinMeta } from "@/shared/hooks/useCoinMeta";
import { useAddToPortfolio } from "./use-add-to-portfolio";
import { swapQuote } from "@/shared/lib/symbol";

interface Fields {
  symbol: string;
  quantity: string;
  buyPrice: string;
}

const initialFields: Fields = { symbol: "", quantity: "", buyPrice: "" };
const DEFAULT_QUOTE = "USDT";

export const usePositionForm = ({ onSuccessAction }: { onSuccessAction: () => void }) => {
  const { add, loading } = useAddToPortfolio();
  const [fields, setFields] = useState<Fields>(initialFields);
  const [quote, setQuote] = useState<string>(DEFAULT_QUOTE);
  const quotes = useQuoteCurrencies();
  const { pairs } = useCoinMeta(quote);

  // Effective symbol: user's choice if still valid for current pairs, otherwise the first pair.
  // Derived in render — no effect needed.
  const effectiveSymbol = pairs.length === 0
    ? ""
    : (fields.symbol && pairs.some((p) => p.symbol === fields.symbol))
      ? fields.symbol
      : pairs[0].symbol;

  const handleSetQuote = useCallback((newQuote: string) => {
    if (newQuote === quote) return;
    if (effectiveSymbol) {
      setFields((f) => (
          { ...f, symbol: swapQuote(effectiveSymbol, quote, newQuote) }
      ));
    }
    setQuote(newQuote);
  }, [quote, effectiveSymbol]);

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const coin = pairs.find((c) => c.symbol === effectiveSymbol);
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
    fields: { ...fields, symbol: effectiveSymbol },
    set,
    submit,
    loading,
    noPairs: pairs.length === 0,
    quote,
    setQuote: handleSetQuote,
    quotes,
    pairs,
  };
};
