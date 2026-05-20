"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import type { CoinMeta } from "@/entities/coin";
import { CoinOption } from "./CoinOption";
import { styles } from "./styles";

interface CoinDropdownProps {
  listboxId: string;
  results: CoinMeta[];
  selectedSymbol: string;
  quote: string;
  rect: DOMRect;
  activeIndex: number;
  onSelect: (coin: CoinMeta) => void;
  onHoverItem: (index: number) => void;
}

export const CoinDropdown = ({
  listboxId,
  results,
  selectedSymbol,
  quote,
  rect,
  activeIndex,
  onSelect,
  onHoverItem,
}: CoinDropdownProps) => {
  const t = useTranslations("dashboard.search");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, results]);

  const positionStyle = {
    position: "fixed" as const,
    top: rect.bottom + 8,
    left: rect.left,
    width: rect.width,
    zIndex: 60,
  };

  return createPortal(
    <div
      ref={listRef}
      id={listboxId}
      role="listbox"
      style={positionStyle}
      className={styles.dropdown}
    >
      {results.length === 0 ? (
        <p className={styles.empty}>{t("noResults")}</p>
      ) : (
        results.map((coin, idx) => (
          <CoinOption
            key={coin.symbol}
            coin={coin}
            optionId={`${listboxId}-option-${idx}`}
            quote={quote}
            active={idx === activeIndex}
            selected={coin.symbol === selectedSymbol}
            onSelect={() => onSelect(coin)}
            onHover={() => onHoverItem(idx)}
          />
        ))
      )}
    </div>,
    document.body,
  );
};
