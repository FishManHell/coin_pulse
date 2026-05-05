"use client";

import { Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { useAppStore } from "@/shared/store";
import { useRemoveFromWatchlist } from "@/features/remove-from-watchlist";
import { formatPrice, formatPercent, cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { styles } from "./styles";
import type { WatchlistItem } from "@/shared/types";

export const WatchlistRow = ({ item }: { item: WatchlistItem }) => {
  const ticker = useAppStore((s) => s.prices[item.symbol]);
  const { remove, loading } = useRemoveFromWatchlist();

  const isUp = (ticker?.priceChangePercent ?? 0) >= 0;
  const onRemove = () => remove(item.symbol)

  return (
    <div className={styles.row}>
      <div className={styles.asset}>
        <div className={styles.avatar}>{item.name[0]}</div>
        <div>
          <p className={styles.assetName}>{item.name}</p>
          <p className={styles.assetTicker}>
            {item.symbol.slice(0, -item.quote.length)}/{item.quote}
          </p>
        </div>
      </div>

      <span className={styles.pricePrimary}>
        {ticker ? `$${formatPrice(ticker.price)}` : <Skeleton className="w-20 h-4" />}
      </span>

      <span
        className={cn(
          styles.changeCell,
          ticker && (isUp ? "text-price-up" : "text-price-down"),
        )}
      >
        {ticker ? (
          <>
            {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {formatPercent(ticker.priceChangePercent)}
          </>
        ) : (
          <Skeleton className="w-16 h-4" />
        )}
      </span>

      <span className={styles.volumeCell}>
        {ticker ? `$${(ticker.volume * ticker.price / 1_000_000).toFixed(1)}M` : <Skeleton className="w-14 h-4" />}
      </span>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        disabled={loading}
        aria-label="Remove from watchlist"
        className={styles.trashBtn}
      >
        <Trash2 />
      </Button>
    </div>
  );
};
