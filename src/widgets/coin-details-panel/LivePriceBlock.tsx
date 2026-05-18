"use client";

import { usePricesStore } from "@/entities/coin";
import { PriceBlock } from "./PriceBlock";
import { PriceBlockSkeleton } from "./PriceBlockSkeleton";

export const LivePriceBlock = ({ symbol }: { symbol: string }) => {
  const ticker = usePricesStore((s) => s.prices[symbol]);
  return ticker ? <PriceBlock ticker={ticker} /> : <PriceBlockSkeleton />;
};
