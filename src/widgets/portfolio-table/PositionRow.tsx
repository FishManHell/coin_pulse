"use client";

import { useState, KeyboardEvent } from "react";
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePricesStore } from "@/entities/coin";
import { formatPrice, formatPercent, cn } from "@/shared/lib/utils";
import { CoinIcon } from "@/shared/ui/coin-icon";
import { styles } from "./styles";
import { TransactionRow } from "./TransactionRow";
import { PositionRowSkeleton } from "./PositionRowSkeleton";
import type { GroupedPosition } from "./group-positions";
import { computePositionPnl } from "./compute-position-pnl";

interface PositionRowProps {
  group: GroupedPosition;
}

export const PositionRow = ({ group }: PositionRowProps) => {
  const [expanded, setExpanded] = useState(false);
  const ticker = usePricesStore((s) => s.prices[group.symbol]);
  const t = useTranslations("portfolio.table");

  if (!ticker) return <PositionRowSkeleton group={group} />;

  const base = group.symbol.slice(0, -group.quote.length);
  const { currentPrice, pnl, pnlPct, isUp } = computePositionPnl(group, ticker?.price);

  const toggleExpanded = () => setExpanded((v) => !v);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    toggleExpanded();
  };

  return (
    <>
      <div
        className={styles.row}
        onClick={toggleExpanded}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <span className={styles.expandIcon}>
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
        <div className="flex items-center gap-3">
          <CoinIcon base={base} size="sm" />
          <div>
            <p className={styles.assetName}>{group.name}</p>
            <p className={styles.assetTicker}>
              {base}/{group.quote} · {t("buysCount", { count: group.transactions.length })}
            </p>
          </div>
        </div>
        <span className={styles.cellSecondary}>{group.totalQty}</span>
        <span className={styles.cellSecondary}>${formatPrice(group.avgBuyPrice)}</span>
        <span className={styles.cellPrimary}>${formatPrice(currentPrice)}</span>
        <span className={cn(styles.pnlCell, isUp ? "text-price-up" : "text-price-down")}>
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isUp ? "+" : ""}${formatPrice(Math.abs(pnl))}
          <span className="text-xs opacity-70">({formatPercent(pnlPct)})</span>
        </span>
        <span />
      </div>

      {expanded && (
        <div className={styles.txWrap}>
          {group.transactions.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </div>
      )}
    </>
  );
};
