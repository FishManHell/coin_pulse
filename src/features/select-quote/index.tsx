"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/shared/store";
import { symbolExists } from "@/shared/api/binance-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

export const QuoteSelector = () => {
  const [quotes, setQuotes] = useState<string[]>(["USDT"]);
  const selectedQuote = useAppStore((s) => s.selectedQuote);
  const setSelectedQuote = useAppStore((s) => s.setSelectedQuote);
  const setSelectedSymbol = useAppStore((s) => s.setSelectedSymbol);

  useEffect(() => {
    fetch("/api/quote-currencies")
      .then((r) => r.json())
      .then(setQuotes);
  }, []);

  const handleQuoteChange = async (newQuote: string) => {
    if (newQuote === selectedQuote) return;

    const oldSymbol = useAppStore.getState().selectedSymbol;
    let candidate: string | null = null;

    if (oldSymbol.endsWith(selectedQuote)) {
      const base = oldSymbol.slice(0, -selectedQuote.length);
      const candidateSymbol = `${base}${newQuote}`;
      const valid = await symbolExists(candidateSymbol).catch(() => false);
      if (valid) candidate = candidateSymbol;
    }

    if (candidate) setSelectedSymbol(candidate);
    setSelectedQuote(newQuote);
    // If candidate is null/invalid, useTopCoins will set selectedSymbol = top[0]
    // once its fetch resolves (it only falls back when current symbol is stale).
  };

  return (
    <Select value={selectedQuote} onValueChange={handleQuoteChange}>
      <SelectTrigger className="w-24 h-9 rounded-xl text-xs border-border-base bg-bg">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-surface border-border-base">
        {quotes.map((q) => (
          <SelectItem key={q} value={q} className="text-xs cursor-pointer">
            {q}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
