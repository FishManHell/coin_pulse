"use client";

import { useCallback } from "react";
import { useAppStore } from "@/shared/store";
import { useCoinMeta } from "@/shared/hooks/useCoinMeta";
import { useAddToWatchlist } from "@/features/add-to-watchlist";
import { useRemoveFromWatchlist } from "@/features/remove-from-watchlist";
import { PriceCard } from "@/entities/coin/ui/price-card";
import { SkeletonCard } from "./SkeletonCard";
import { NoDataCard } from "./NoDataCard";

interface LivePriceCardProps {
  symbol: string;
  timedOut: boolean;
}

export const LivePriceCard = ({ symbol, timedOut }: Readonly<LivePriceCardProps>) => {
  const ticker = useAppStore((s) => s.prices[symbol]);
  const selected = useAppStore((s) => s.selectedSymbol === symbol);
  const setSelectedSymbol = useAppStore((s) => s.setSelectedSymbol);
  const selectedQuote = useAppStore((s) => s.selectedQuote);
  const isWatched = useAppStore((s) => s.watchlist.some((w) => w.symbol === symbol));
  const { names } = useCoinMeta(selectedQuote);
  const { add, loading: adding } = useAddToWatchlist();
  const { remove, loading: removing } = useRemoveFromWatchlist();

  const onClick = useCallback(() => setSelectedSymbol(symbol), [symbol, setSelectedSymbol]);

  const onToggleWatch = useCallback(() => {
    if (isWatched) {
      remove(symbol);
      return;
    }
    const base = symbol.slice(0, -selectedQuote.length);
    add(symbol, names[base] ?? base, selectedQuote);
  }, [isWatched, symbol, selectedQuote, names, add, remove]);

  if (!ticker) return timedOut ? <NoDataCard /> : <SkeletonCard />;
  return (
    <PriceCard
      ticker={ticker}
      selected={selected}
      onClick={onClick}
      isWatched={isWatched}
      onToggleWatch={onToggleWatch}
      toggling={adding || removing}
    />
  );
};
