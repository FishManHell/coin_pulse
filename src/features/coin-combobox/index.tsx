"use client";

import { useState, useRef, useMemo, type ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { useDismiss } from "@/shared/hooks/useDismiss";
import { stripQuote } from "@/shared/lib/symbol";
import { cn } from "@/shared/lib/utils";
import { SearchInput } from "@/shared/ui/search-input";
import { useFloatingRect } from "@/shared/hooks/useFloatingRect";
import type { CoinMeta } from "@/entities/coin";
import { CoinDropdown } from "./CoinDropdown";

interface CoinComboboxProps {
  value: string;
  onChange: (coin: CoinMeta) => void;
  pairs: CoinMeta[];
  quote: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const CoinCombobox = ({
  value,
  onChange,
  pairs,
  quote,
  disabled,
  placeholder,
  className,
}: CoinComboboxProps) => {
  const t = useTranslations("dashboard.search");
  const effectivePlaceholder = placeholder ?? t("comboboxPlaceholder");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [userSelected, setUserSelected] = useState(false);
  const [wasOpen, setWasOpen] = useState(false);
  const [syncedShort, setSyncedShort] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useDismiss(containerRef, () => setOpen(false), open);
  const rect = useFloatingRect(containerRef, open);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return pairs
      .filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, pairs]);

  const selected = pairs.find((c) => c.symbol === value);
  const selectedShort = selected ? stripQuote(selected.symbol, quote) : "";

  // Sync input to selection on close-transition or when selectedShort changes externally
  // (e.g. parent swaps quote) while closed. Canonical "adjust state on prop change" pattern.
  const justClosed = wasOpen && !open;
  const externalChange = !open && selectedShort !== "" && selectedShort !== syncedShort;
  if (userSelected && (justClosed || externalChange)) {
    setSyncedShort(selectedShort);
    setQuery(selectedShort);
  }
  if (wasOpen !== open) setWasOpen(open);

  const handleSelect = (coin: CoinMeta) => {
    onChange(coin);
    setUserSelected(true);
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(true);
  };

  const handleFocus = () => setOpen(true);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <SearchInput
        ref={inputRef}
        value={query}
        onChange={handleQueryChange}
        onFocus={handleFocus}
        disabled={disabled}
        placeholder={selectedShort || effectivePlaceholder}
      />
      {open && rect && query.length > 0 && (
        <CoinDropdown
          results={results}
          selectedSymbol={value}
          quote={quote}
          rect={rect}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
};
