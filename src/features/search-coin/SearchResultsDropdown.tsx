"use client";

import type { CoinMeta, CoinTicker } from "@/shared/types";
import { SearchResultItem } from "./SearchResultItem";
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
      {results.map((coin) => (
        <SearchResultItem
          key={coin.symbol}
          coin={coin}
          ticker={prices[coin.symbol]}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
