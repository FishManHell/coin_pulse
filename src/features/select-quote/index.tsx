"use client";

import { useSelectionStore } from "@/shared/store";
import { useQuoteCurrencies } from "@/shared/hooks/useQuoteCurrencies";
import { symbolExists } from "@/shared/api/binance/client";
import { swapQuote } from "@/shared/lib/symbol";
import { CoinIcon } from "@/shared/ui/coin-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

export const QuoteSelector = () => {
  const quotes = useQuoteCurrencies();
  const selectedQuote = useSelectionStore((s) => s.selectedQuote);
  const setSelectedQuote = useSelectionStore((s) => s.setSelectedQuote);
  const setSelectedSymbol = useSelectionStore((s) => s.setSelectedSymbol);

  const handleQuoteChange = async (newQuote: string) => {
    if (newQuote === selectedQuote) return;

    const oldSymbol = useSelectionStore.getState().selectedSymbol;
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
      <SelectTrigger className="w-9 sm:w-28 h-9 rounded-xl text-xs border-border-base bg-bg p-0 sm:px-3 justify-center sm:justify-between [&>svg]:hidden sm:[&>svg]:block">
        <span className="sm:hidden">
          <CoinIcon base={selectedQuote} size="sm" />
        </span>
        <span className="hidden sm:inline">
          <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent className="bg-surface border-border-base">
        {quotes.map((q) => (
          <SelectItem
            key={q}
            value={q}
            textValue={q}
            className="text-xs cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <CoinIcon base={q} size="sm" />
              <span>{q}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
