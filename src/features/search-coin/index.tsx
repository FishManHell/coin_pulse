"use client";

import { useState, useRef, useCallback, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/shared/store";
import { useDismiss } from "@/shared/hooks/useDismiss";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/config/routes";
import { SearchInput } from "@/shared/ui/search-input";
import type { CoinMeta } from "@/entities/coin/types";
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

  const setSelectedSymbol = useAppStore((s) => s.setSelectedSymbol);

  const close = useCallback(() => {
    setOpen(false);
    inputRef.current?.blur();
  }, []);

  useDismiss(containerRef, close, open);

  const handleSelect = useCallback(
    (coin: CoinMeta) => {
      setSelectedSymbol(coin.symbol);
      router.push(ROUTES.dashboard);
      setQuery("");
      setOpen(false);
    },
    [router, setSelectedSymbol],
  );

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
      {open && <SearchResultsDropdown query={query} onSelect={handleSelect} />}
    </div>
  );
};
