"use client";

import { usePriceStream } from "@/entities/coin";
import { SkeletonCard } from "./SkeletonCard";
import { EmptyState } from "./EmptyState";
import { LivePriceCard } from "./LivePriceCard";
import { useTopCoins } from "./use-top-coins";
import { styles } from "./styles";

const SKELETON_COUNT = 6;

export const MarketOverview = ({ initialSymbols }: { initialSymbols: string[] }) => {
  const { symbols, fetching, timedOut } = useTopCoins(initialSymbols);
  usePriceStream(symbols);

  const renderContent = () => {
    if (fetching) return Array.from({ length: SKELETON_COUNT }, (_, i) => <SkeletonCard key={i} />);
    if (symbols.length === 0) return <EmptyState />;
    return symbols.map((s) => <LivePriceCard key={s} symbol={s} timedOut={timedOut} />);
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
