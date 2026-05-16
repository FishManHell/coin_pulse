"use client";

import { useAppStore } from "@/shared/store";
import { PriceBlock } from "./PriceBlock";
import { PriceBlockSkeleton } from "./PriceBlockSkeleton";

export const LivePriceBlock = ({ symbol }: { symbol: string }) => {
  const ticker = useAppStore((s) => s.prices[symbol]);
  return ticker ? <PriceBlock ticker={ticker} /> : <PriceBlockSkeleton />;
};
