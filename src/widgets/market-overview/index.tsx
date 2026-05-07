"use client";

import { useAppStore } from "@/shared/store";
import { usePriceStream } from "@/shared/hooks/usePriceStream";
import { PriceCard } from "@/entities/coin/components/price-card";
import { SkeletonCard } from "./SkeletonCard";
import { EmptyState } from "./EmptyState";
import { NoDataCard } from "./NoDataCard";
import { useTopCoins } from "./use-top-coins";
import { styles } from "./styles";

const SKELETON_COUNT = 6;

export const MarketOverview = ({ initialSymbols }: { initialSymbols: string[] }) => {
  const prices = useAppStore((s) => s.prices);
  const selectedSymbol = useAppStore((s) => s.selectedSymbol);
  const setSelectedSymbol = useAppStore((s) => s.setSelectedSymbol);

  const { symbols, fetching, timedOut } = useTopCoins(initialSymbols);
  usePriceStream(symbols);

  const renderSkeletons = () => {
    return Array.from({ length: SKELETON_COUNT }, (_, i) => <SkeletonCard key={i} />)
  };

  const renderTicker = (symbol: string) => {
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
  };

  const renderContent = () => {
    if (fetching) return renderSkeletons();
    if (symbols.length === 0) return <EmptyState />;
    return symbols.map(renderTicker);
  };

  return (
    <section>
      <div className={styles.headerRow}>
        <div>
          <p className={styles.eyebrow}>Live prices</p>
          <h2 className={styles.title}>Top Assets</h2>
        </div>
        <span className={styles.liveRow}>
          <span className={styles.liveDot} />
          Live
        </span>
      </div>

      <div className={styles.grid}>{renderContent()}</div>
    </section>
  );
};
