"use client";

import { useState, useRef, useMemo, useId, type ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { useDismiss } from "@/shared/hooks/useDismiss";
import { stripQuote } from "@/shared/lib/symbol";
import { cn } from "@/shared/lib/utils";
import { SearchInput } from "@/shared/ui/search-input";
import { useFloatingRect } from "@/shared/hooks/useFloatingRect";
import type { CoinMeta } from "@/entities/coin";
import { CoinDropdown } from "./CoinDropdown";
import { useComboboxKeyboard } from "./use-combobox-keyboard";

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
  const listboxId = useId();
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

  const handleSelect = (coin: CoinMeta) => {
    onChange(coin);
    setUserSelected(true);
    setOpen(false);
    inputRef.current?.blur();
  };

  const { activeIndex, onKeyDown, onHoverItem } = useComboboxKeyboard({
    open,
    setOpen,
    results,
    onSelect: handleSelect,
  });

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

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(true);
  };

  const showDropdown = open && rect && query.length > 0;
  const activeId = activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <SearchInput
        ref={inputRef}
        value={query}
        onChange={handleQueryChange}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder={selectedShort || effectivePlaceholder}
        role="combobox"
        aria-expanded={Boolean(showDropdown)}
        aria-controls={showDropdown ? listboxId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={showDropdown ? activeId : undefined}
      />
      {showDropdown && (
        <CoinDropdown
          listboxId={listboxId}
          results={results}
          selectedSymbol={value}
          quote={quote}
          rect={rect}
          activeIndex={activeIndex}
          onSelect={handleSelect}
          onHoverItem={onHoverItem}
        />
      )}
    </div>
  );
};
