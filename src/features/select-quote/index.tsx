"use client";

import { useAppStore } from "@/shared/store";
import { useQuoteCurrencies } from "@/shared/hooks/useQuoteCurrencies";
import { symbolExists } from "@/shared/api/binance/client";
import { swapQuote } from "@/shared/lib/symbol";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

export const QuoteSelector = () => {
  const quotes = useQuoteCurrencies();
  const selectedQuote = useAppStore((s) => s.selectedQuote);
  const setSelectedQuote = useAppStore((s) => s.setSelectedQuote);
  const setSelectedSymbol = useAppStore((s) => s.setSelectedSymbol);

  const handleQuoteChange = async (newQuote: string) => {
    if (newQuote === selectedQuote) return;

    const oldSymbol = useAppStore.getState().selectedSymbol;
    let candidate: string | null = null;

    if (oldSymbol.endsWith(selectedQuote)) {
      const candidateSymbol = swapQuote(oldSymbol, selectedQuote, newQuote);
      const valid = await symbolExists(candidateSymbol).catch(() => false);
      if (valid) candidate = candidateSymbol;
    }

    if (candidate) setSelectedSymbol(candidate);
    setSelectedQuote(newQuote);
    // useTopCoins handles fallback when candidate is null (avoids double-set race).
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
