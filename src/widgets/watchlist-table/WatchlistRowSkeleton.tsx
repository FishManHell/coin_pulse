"use client";

import { Trash2 } from "lucide-react";
import { useRemoveFromWatchlist } from "@/features/remove-from-watchlist";
import { Button } from "@/shared/ui/button";
import { CoinIcon } from "@/shared/ui/coin-icon";
import { Skeleton } from "@/shared/ui/skeleton";
import { styles } from "./styles";
import type { WatchlistItem } from "@/shared/types";

export const WatchlistRowSkeleton = ({ item }: { item: WatchlistItem }) => {
  const { remove, loading } = useRemoveFromWatchlist();
  const base = item.symbol.slice(0, -item.quote.length);
  const onRemove = () => remove(item.symbol);

  return (
    <div className={styles.row}>
      <div className={styles.asset}>
        <CoinIcon base={base} size="sm" />
        <div>
          <p className={styles.assetName}>{item.name}</p>
          <p className={styles.assetTicker}>
            {base}/{item.quote}
          </p>
        </div>
      </div>
      <span className={styles.pricePrimary}>
        <Skeleton className="w-20 h-4" />
      </span>
      <span className={styles.changeCell}>
        <Skeleton className="w-16 h-4" />
      </span>
      <span className={styles.volumeCell}>
        <Skeleton className="w-14 h-4" />
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
