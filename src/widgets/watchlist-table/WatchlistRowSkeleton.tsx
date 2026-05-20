"use client";

import { useTranslations } from "next-intl";
import { useRemoveFromWatchlist } from "@/features/remove-from-watchlist";
import { CoinIcon } from "@/shared/ui/coin-icon";
import { DeleteIconButton } from "@/shared/ui/delete-icon-button";
import { Skeleton } from "@/shared/ui/skeleton";
import { styles } from "./styles";
import type { WatchlistItem } from "@/entities/watchlist";

export const WatchlistRowSkeleton = ({ item }: { item: WatchlistItem }) => {
  const { remove, loading } = useRemoveFromWatchlist();
  const tActions = useTranslations("watchlist.actions");
  const tConfirm = useTranslations("confirms.deleteWatchlistItem");
  const base = item.symbol.slice(0, -item.quote.length);

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
      <DeleteIconButton
        onConfirm={() => remove(item.symbol)}
        disabled={loading}
        ariaLabel={tActions("remove")}
        confirm={{
          title: tConfirm("title"),
          confirm: tConfirm("confirm"),
          cancel: tConfirm("cancel"),
        }}
      />
    </div>
  );
};
