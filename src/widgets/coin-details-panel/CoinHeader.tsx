"use client";

import { Star, StarOff } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { CoinIcon } from "@/shared/ui/coin-icon";
import { Skeleton } from "@/shared/ui/skeleton";
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

    <Button
      variant="ghost"
      size="icon-sm"
      onClick={onToggleWatch}
      className={cn(styles.starButton, isWatched ? styles.starButtonActive : styles.starButtonInactive)}
    >
      {isWatched ? <Star size={15} fill="currentColor" /> : <StarOff size={15} />}
    </Button>
  </div>
);
