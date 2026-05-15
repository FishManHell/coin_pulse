"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { CoinIcon } from "@/shared/ui/coin-icon";
import { stripQuote } from "@/shared/lib/symbol";
import { formatPrice, cn } from "@/shared/lib/utils";
import type { CoinMeta, CoinTicker } from "@/shared/types";
import { styles } from "./styles";

interface SearchResultItemProps {
  coin: CoinMeta;
  ticker?: CoinTicker;
  onSelect: (coin: CoinMeta) => void;
}

export const SearchResultItem = ({ coin, ticker, onSelect }: SearchResultItemProps) => {
  const base = stripQuote(coin.symbol, "USDT");
  const isUp = (ticker?.priceChangePercent ?? 0) >= 0;

  const handleMouseDown = () => onSelect(coin);

  return (
    <button onMouseDown={handleMouseDown} className={styles.row}>
      <div className={styles.rowLeft}>
        <CoinIcon base={base} size="sm" />
        <div>
          <p className={styles.rowName}>{coin.name}</p>
          <p className={styles.rowPair}>{base}/USDT</p>
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
