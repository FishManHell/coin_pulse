"use client";

import { KeyboardEvent } from "react";
import { cn } from "@/shared/lib/utils";
import { useAppStore } from "@/shared/store";
import { useCoinMeta } from "@/shared/hooks/useCoinMeta";
import { useAddToWatchlist } from "@/features/add-to-watchlist";
import { useRemoveFromWatchlist } from "@/features/remove-from-watchlist";
import type { CoinTicker } from "@/shared/types";
import { WatchlistStarButton } from "@/shared/ui/watchlist-star-button";
import { PriceBody } from "./PriceBody";
import { PriceCardHeader } from "./PriceCardHeader";
import { PriceChangeBadge } from "./PriceChangeBadge";
import { usePriceFlash } from "./use-price-flash";
import { styles } from "./styles";

interface PriceCardProps {
  ticker: CoinTicker;
  onClick?: () => void;
  selected?: boolean;
}

export const PriceCard = ({ ticker, onClick, selected }: Readonly<PriceCardProps>) => {
  const selectedQuote = useAppStore((s) => s.selectedQuote);
  const { names } = useCoinMeta(selectedQuote);
  const watchlist = useAppStore((s) => s.watchlist);
  const { add } = useAddToWatchlist();
  const { remove } = useRemoveFromWatchlist();

  const base = ticker.symbol.slice(0, -selectedQuote.length);
  const displayName = names[base] ?? base;
  const isWatched = watchlist.some((w) => w.symbol === ticker.symbol);
  const flash = usePriceFlash(ticker.price);

  const handleClick = () => onClick?.();

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") onClick?.();
  };

  const handleToggleWatch = () => {
    if (isWatched) {
      remove(ticker.symbol);
      return;
    }
    add(ticker.symbol, displayName, selectedQuote);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        styles.card,
        selected ? styles.cardSelected : styles.cardDefault,
        flash === "up" && styles.flashUp,
        flash === "down" && styles.flashDown,
      )}
    >
      <div className={styles.topRow}>
        <PriceCardHeader base={base} quote={selectedQuote} displayName={displayName} />
        <div className={styles.topRight}>
          <PriceChangeBadge changePercent={ticker.priceChangePercent} />
          <WatchlistStarButton isWatched={isWatched} onToggle={handleToggleWatch} stopPropagation />
        </div>
      </div>

      <PriceBody price={ticker.price} change={ticker.priceChange} />
    </div>
  );
};
