"use client";

import { useCallback } from "react";
import { useAppStore } from "@/shared/store";
import { PriceCard } from "@/entities/coin/components/price-card";
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

  const onClick = useCallback(() => setSelectedSymbol(symbol), [symbol, setSelectedSymbol]);

  if (!ticker) return timedOut ? <NoDataCard /> : <SkeletonCard />;
  return <PriceCard ticker={ticker} selected={selected} onClick={onClick} />;
};
