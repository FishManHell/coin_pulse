"use client";

import type { MouseEvent } from "react";
import { cn } from "@/shared/lib/utils";
import { stripQuote } from "@/shared/lib/symbol";
import type { CoinMeta } from "@/entities/coin";
import { styles } from "./styles";

interface CoinOptionProps {
  coin: CoinMeta;
  optionId: string;
  quote: string;
  active: boolean;
  selected: boolean;
  onSelect: () => void;
  onHover: () => void;
}

export const CoinOption = ({
  coin,
  optionId,
  quote,
  active,
  selected,
  onSelect,
  onHover,
}: CoinOptionProps) => {
  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSelect();
  };

  return (
    <button
      id={optionId}
      type="button"
      role="option"
      aria-selected={active}
      data-active={active || undefined}
      onMouseDown={handleMouseDown}
      onMouseEnter={onHover}
      className={cn(
        styles.dropdownItem,
        active ? styles.dropdownItemActive : selected && styles.dropdownItemSelected,
      )}
    >
      <span className={styles.itemSymbol}>{stripQuote(coin.symbol, quote)}</span>
      <span className={styles.itemName}>{coin.name}</span>
    </button>
  );
};
