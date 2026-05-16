"use client";

import { useMemo } from "react";
import { useCoinFilter } from "@/shared/hooks/useCoinFilter";
import type { CoinMeta } from "@/entities/coin/types";
import { SearchResultItem } from "./SearchResultItem";
import { useSearchTickersSnapshot } from "./use-search-tickers-snapshot";
import { styles } from "./styles";

interface SearchResultsDropdownProps {
  query: string;
  onSelect: (coin: CoinMeta) => void;
}

export const SearchResultsDropdown = ({ query, onSelect }: SearchResultsDropdownProps) => {
  const results = useCoinFilter(query, { limit: 6 });
  const symbols = useMemo(() => results.map((r) => r.symbol), [results]);
  useSearchTickersSnapshot(symbols);

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
        <SearchResultItem key={coin.symbol} coin={coin} onSelect={onSelect} />
      ))}
    </div>
  );
};
