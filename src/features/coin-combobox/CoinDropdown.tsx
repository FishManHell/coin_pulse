"use client";

import { createPortal } from "react-dom";
import { cn } from "@/shared/lib/utils";
import { stripQuote } from "@/shared/lib/symbol";
import type { CoinMeta } from "@/shared/types";
import { styles } from "./styles";

interface CoinDropdownProps {
  results: CoinMeta[];
  selectedSymbol: string;
  quote: string;
  rect: DOMRect;
  onSelect: (coin: CoinMeta) => void;
}

export const CoinDropdown = ({
  results,
  selectedSymbol,
  quote,
  rect,
  onSelect,
}: CoinDropdownProps) => {
  return createPortal(
    <div
      style={{
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
        zIndex: 60,
      }}
      className={styles.dropdown}
    >
      {results.length > 0 ? (
        results.map((coin) => (
          <button
            key={coin.symbol}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(coin);
            }}
            className={cn(
              styles.dropdownItem,
              coin.symbol === selectedSymbol && styles.dropdownItemActive
            )}
          >
            <span className={styles.itemSymbol}>{stripQuote(coin.symbol, quote)}</span>
            <span className={styles.itemName}>{coin.name}</span>
          </button>
        ))
      ) : (
        <p className={styles.empty}>No coins found</p>
      )}
    </div>,
    document.body
  );
};
