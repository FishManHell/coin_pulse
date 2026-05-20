"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePricesStore } from "@/entities/coin";
import { useRemoveFromWatchlist } from "@/features/remove-from-watchlist";
import { formatPrice, formatPercent, cn } from "@/shared/lib/utils";
import { CoinIcon } from "@/shared/ui/coin-icon";
import { DeleteIconButton } from "@/shared/ui/delete-icon-button";
import { WatchlistRowSkeleton } from "./WatchlistRowSkeleton";
import { styles } from "./styles";
import type { WatchlistItem } from "@/entities/watchlist";

export const WatchlistRow = ({ item }: { item: WatchlistItem }) => {
  const ticker = usePricesStore((s) => s.prices[item.symbol]);
  const { remove, loading } = useRemoveFromWatchlist();
  const tActions = useTranslations("watchlist.actions");
  const tConfirm = useTranslations("confirms.deleteWatchlistItem");

  if (!ticker) return <WatchlistRowSkeleton item={item} />;

  const base = item.symbol.slice(0, -item.quote.length);
  const isUp = ticker.priceChangePercent >= 0;

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

      <span className={styles.pricePrimary}>${formatPrice(ticker.price)}</span>

      <span className={cn(styles.changeCell, isUp ? "text-price-up" : "text-price-down")}>
        {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        {formatPercent(ticker.priceChangePercent)}
      </span>

      <span className={styles.volumeCell}>
        ${(ticker.volume * ticker.price / 1_000_000).toFixed(1)}M
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
