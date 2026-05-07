"use client";

import { CoinIcon } from "@/shared/ui/coin-icon";
import { Skeleton } from "@/shared/ui/skeleton";
import { WatchlistStarButton } from "@/shared/ui/watchlist-star-button";
import { styles } from "./styles";

interface CoinHeaderProps {
  base: string;
  quote: string;
  displayName: string | undefined;
  isWatched: boolean;
  onToggleWatch: () => void;
}

export const CoinHeader = ({ base, quote, displayName, isWatched, onToggleWatch }: CoinHeaderProps) => (
  <div className={styles.coinHeaderRow}>
    <div className={styles.coinHeaderInfo}>
      <CoinIcon base={base} size="md" />
      <div>
        {displayName ? (
          <p className={styles.coinName}>{displayName}</p>
        ) : (
          <Skeleton className="w-20 h-3.5 mb-1" />
        )}
        <p className={styles.coinTicker}>{base}/{quote}</p>
      </div>
    </div>

    <WatchlistStarButton isWatched={isWatched} onToggle={onToggleWatch} size={15} />
  </div>
);
