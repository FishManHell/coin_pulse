"use client";

import { useState, useRef, useCallback, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/shared/store";
import { useCoinFilter } from "@/shared/lib/use-coin-filter";
import { useDismiss } from "@/shared/lib/use-dismiss";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/config/routes";
import { SearchInput } from "@/shared/ui/search-input";
import type { CoinMeta } from "@/shared/types";
import { SearchResultsDropdown } from "./SearchResultsDropdown";
import { styles } from "./styles";

interface SearchCoinProps {
  className?: string;
  autoFocus?: boolean;
}

export const SearchCoin = ({ className, autoFocus }: SearchCoinProps) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const prices = useAppStore((s) => s.prices);
  const setSelectedSymbol = useAppStore((s) => s.setSelectedSymbol);
  const results = useCoinFilter(query, { limit: 6 });

  const close = useCallback(() => {
    setOpen(false);
    inputRef.current?.blur();
  }, []);

  useDismiss(containerRef, close, open);

  const handleSelect = (coin: CoinMeta) => {
    setSelectedSymbol(coin.symbol);
    router.push(ROUTES.dashboard);
    setQuery("");
    setOpen(false);
  };

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(true);
  };

  const handleFocus = () => setOpen(true);

  return (
    <div ref={containerRef} className={cn(styles.container, className)}>
      <SearchInput
        ref={inputRef}
        autoFocus={autoFocus}
        value={query}
        onChange={handleQueryChange}
        onFocus={handleFocus}
        placeholder="Search coins…"
        className="bg-bg pr-4"
      />
      {open && (
        <SearchResultsDropdown
          results={results}
          query={query}
          prices={prices}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
};
