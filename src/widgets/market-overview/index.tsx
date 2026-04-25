"use client";

import { useAppStore } from "@/shared/store";
import { usePriceStream } from "@/shared/hooks/usePriceStream";
import { PriceCard } from "@/entities/coin/components/PriceCard";
import { SkeletonCard } from "./SkeletonCard";
import { EmptyState } from "./EmptyState";
import { NoDataCard } from "./NoDataCard";
import { useTopCoins } from "./use-top-coins";

const SKELETON_COUNT = 6;

type Props = { initialSymbols: string[] };

export const MarketOverview = ({ initialSymbols }: Props) => {
  const prices = useAppStore((s) => s.prices);
  const selectedSymbol = useAppStore((s) => s.selectedSymbol);
  const setSelectedSymbol = useAppStore((s) => s.setSelectedSymbol);

  const { symbols, fetching, timedOut } = useTopCoins(initialSymbols);
  usePriceStream(symbols);

  const renderContent = () => {
    if (fetching) return Array.from({ length: SKELETON_COUNT }, (_, i) => {
      return <SkeletonCard key={i} />
    });

    if (symbols.length === 0) return <EmptyState />;

    return symbols.map((symbol) => {
      const ticker = prices[symbol];
      if (!ticker) return timedOut ? <NoDataCard key={symbol} /> : <SkeletonCard key={symbol} />;
      return (
        <PriceCard
          key={symbol}
          ticker={ticker}
          selected={selectedSymbol === symbol}
          onClick={() => setSelectedSymbol(symbol)}
        />
      );
    });
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Live prices</p>
          <h2 className="text-lg font-semibold text-text-primary">Top Assets</h2>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-price-up">
          <span className="w-1.5 h-1.5 rounded-full bg-price-up animate-pulse" />
          Live
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {renderContent()}
      </div>
    </section>
  );
};
