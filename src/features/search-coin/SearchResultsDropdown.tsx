"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { CoinIcon } from "@/shared/ui/coin-icon";
import { stripQuote } from "@/shared/lib/symbol";
import { formatPrice, cn } from "@/shared/lib/utils";
import type { CoinMeta, CoinTicker } from "@/shared/types";
import { styles } from "./styles";

interface SearchResultsDropdownProps {
  results: CoinMeta[];
  query: string;
  prices: Record<string, CoinTicker>;
  onSelect: (coin: CoinMeta) => void;
}

export const SearchResultsDropdown = ({
  results,
  query,
  prices,
  onSelect,
}: SearchResultsDropdownProps) => {
  if (results.length === 0) {
    if (query.length === 0) return null;
    return (
      <div className={styles.emptyDropdown}>
        <p className={styles.emptyText}>No coins found for &quot;{query}&quot;</p>
      </div>
    );
  }

  return (
    <div className={styles.dropdown}>
      {results.map((coin) => {
        const ticker = prices[coin.symbol];
        const isUp = (ticker?.priceChangePercent ?? 0) >= 0;
        const base = stripQuote(coin.symbol, "USDT");

        return (
          <button
            key={coin.symbol}
            onMouseDown={() => onSelect(coin)}
            className={styles.row}
          >
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
      })}
    </div>
  );
};
