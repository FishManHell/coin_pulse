"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { useAppStore } from "@/shared/store";
import { CoinIcon } from "@/shared/ui/coin-icon";
import { stripQuote } from "@/shared/lib/symbol";
import { formatPrice, cn } from "@/shared/lib/utils";
import type { CoinMeta } from "@/shared/types";
import { styles } from "./styles";

interface SearchResultItemProps {
  coin: CoinMeta;
  onSelect: (coin: CoinMeta) => void;
}

export const SearchResultItem = ({ coin, onSelect }: SearchResultItemProps) => {
  const ticker = useAppStore((s) => s.prices[coin.symbol]);
  const selectedQuote = useAppStore((s) => s.selectedQuote);
  const base = stripQuote(coin.symbol, selectedQuote);
  const isUp = (ticker?.priceChangePercent ?? 0) >= 0;

  const handleMouseDown = () => onSelect(coin);

  return (
    <button onMouseDown={handleMouseDown} className={styles.row}>
      <div className={styles.rowLeft}>
        <CoinIcon base={base} size="sm" />
        <div>
          <p className={styles.rowName}>{coin.name}</p>
          <p className={styles.rowPair}>{base}/{selectedQuote}</p>
        </div>
      </div>

      {ticker && (
        <div className={styles.rowRight}>
          <p className={styles.rowPrice}>${formatPrice(ticker.price)}</p>
          <p
            className={cn(
              styles.rowChangeBase,
              isUp ? "text-price-up" : "text-price-down"
            )}
          >
            {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {isUp ? "+" : ""}
            {ticker.priceChangePercent.toFixed(2)}%
          </p>
        </div>
      )}
    </button>
  );
};
