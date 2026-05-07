"use client";

import { useAppStore } from "@/shared/store";
import { useAddToWatchlist } from "@/features/add-to-watchlist";
import { useRemoveFromWatchlist } from "@/features/remove-from-watchlist";
import { CoinHeader } from "./CoinHeader";
import { PriceBlock } from "./PriceBlock";
import { PriceBlockSkeleton } from "./PriceBlockSkeleton";
import { StatRow } from "./StatRow";
import { StatsBlockSkeleton } from "./StatsBlockSkeleton";
import { getStatRows } from "./get-stat-rows";
import { styles } from "./styles";

export const CoinDetailsPanel = () => {
  const selectedSymbol = useAppStore((s) => s.selectedSymbol);
  const selectedQuote  = useAppStore((s) => s.selectedQuote);
  const ticker         = useAppStore((s) => s.prices[selectedSymbol]);
  const watchlist      = useAppStore((s) => s.watchlist);
  const { add }    = useAddToWatchlist();
  const { remove } = useRemoveFromWatchlist();

  const base        = selectedSymbol.slice(0, -selectedQuote.length);
  const displayName = useAppStore((s) => s.coinNames[base]);
  const isWatched   = watchlist.some((w) => w.symbol === selectedSymbol);

  const onToggleWatch = () => {
      return isWatched ? remove(selectedSymbol) : add(selectedSymbol, displayName ?? base, selectedQuote);
  }

  return (
    <aside className={styles.aside}>
      <div className={styles.headerSection}>
        <CoinHeader
          base={base}
          quote={selectedQuote}
          displayName={displayName}
          isWatched={isWatched}
          onToggleWatch={onToggleWatch}
        />
        {ticker ? <PriceBlock ticker={ticker} /> : <PriceBlockSkeleton />}
      </div>

      <div className={styles.statsSection}>
        <p className={styles.statsTitle}>Market stats</p>
        {ticker ? (
          <div>
            {getStatRows(ticker).map((row) => <StatRow key={row.label} {...row} />)}
          </div>
        ) : (
          <StatsBlockSkeleton />
        )}
      </div>

      <div className={styles.liveFooter}>
        <div className={styles.liveRow}>
          <span className={styles.liveDot} />
          Live data · Binance
        </div>
      </div>
    </aside>
  );
};
