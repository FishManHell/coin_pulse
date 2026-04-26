"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Search } from "lucide-react";
import { useAppStore } from "@/shared/store";
import { useCoinFilter } from "@/shared/lib/use-coin-filter";
import { useDismiss } from "@/shared/lib/use-dismiss";
import { cn } from "@/shared/lib/utils";
import type { CoinMeta } from "@/shared/types";

type Props = {
  value: string;
  onChange: (coin: CoinMeta) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

export const CoinCombobox = ({
  value,
  onChange,
  disabled,
  placeholder = "Search coin…",
  className,
}: Props) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [userSelected, setUserSelected] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const tradeablePairs = useAppStore((s) => s.tradeablePairs);
  const results = useCoinFilter(query, { limit: 8 });

  const selected = useMemo(
    () => tradeablePairs.find((c) => c.symbol === value),
    [tradeablePairs, value],
  );

  const selectedShort = selected ? selected.symbol.replace("USDT", "") : "";

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useDismiss(containerRef, close, open);

  // Sync input value with selected coin only after explicit user selection
  useEffect(() => {
    if (!open && userSelected) setQuery(selectedShort);
  }, [open, userSelected, selectedShort]);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      if (containerRef.current) setRect(containerRef.current.getBoundingClientRect());
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  const handleSelect = (coin: CoinMeta) => {
    onChange(coin);
    setUserSelected(true);
    setOpen(false);
    inputRef.current?.blur();
  };

  const showDropdown = open && rect && query.length > 0;

  const dropdown = showDropdown && (
    <div
      style={{
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
        zIndex: 60,
      }}
      className="bg-surface border border-border-base rounded-2xl shadow-xl max-h-72 overflow-y-auto"
    >
      {results.length > 0 ? (
        results.map((coin) => (
          <button
            key={coin.symbol}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleSelect(coin); }}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-surface-hover transition-colors",
              "border-b border-border-base last:border-0",
              coin.symbol === value && "bg-surface-hover",
            )}
          >
            <span className="font-semibold text-sm text-text-primary">
              {coin.symbol.replace("USDT", "")}
            </span>
            <span className="text-xs text-text-muted truncate">{coin.name}</span>
          </button>
        ))
      ) : (
        <p className="text-sm text-text-muted px-3 py-2">No coins found</p>
      )}
    </div>
  );

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-10" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        disabled={disabled}
        placeholder={selectedShort || placeholder}
        className={cn(
          "w-full bg-surface border border-border-base rounded-xl pl-9 pr-3 py-2 text-sm",
          "text-text-primary placeholder:text-text-muted outline-none",
          "focus:border-accent-indigo transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      />
      {typeof document !== "undefined" && dropdown && createPortal(dropdown, document.body)}
    </div>
  );
};
