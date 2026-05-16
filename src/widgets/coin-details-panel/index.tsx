"use client";

import { useAppStore } from "@/shared/store";
import { useCoinMeta } from "@/shared/hooks/useCoinMeta";
import { useAddToWatchlist } from "@/features/add-to-watchlist";
import { useRemoveFromWatchlist } from "@/features/remove-from-watchlist";
import { CoinHeader } from "./CoinHeader";
import { LivePriceBlock } from "./LivePriceBlock";
import { LiveStats } from "./LiveStats";
import { styles } from "./styles";

export const CoinDetailsPanel = () => {
  const selectedSymbol = useAppStore((s) => s.selectedSymbol);
  const selectedQuote  = useAppStore((s) => s.selectedQuote);
  const isWatched      = useAppStore((s) => s.watchlist.some((w) => w.symbol === selectedSymbol));
  const { add,    loading: adding }   = useAddToWatchlist();
  const { remove, loading: removing } = useRemoveFromWatchlist();

  const { names }   = useCoinMeta(selectedQuote);
  const base        = selectedSymbol.slice(0, -selectedQuote.length);
  const displayName = names[base];

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
          toggling={adding || removing}
        />
        <LivePriceBlock symbol={selectedSymbol} />
      </div>

      <div className={styles.statsSection}>
        <p className={styles.statsTitle}>Market stats</p>
        <LiveStats symbol={selectedSymbol} />
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
