"use client";

import { useState, KeyboardEvent } from "react";
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { usePricesStore } from "@/entities/coin";
import { formatPrice, formatPercent, cn } from "@/shared/lib/utils";
import { CoinIcon } from "@/shared/ui/coin-icon";
import { styles } from "./styles";
import { TransactionRow } from "./TransactionRow";
import { PositionRowSkeleton } from "./PositionRowSkeleton";
import type { GroupedPosition } from "./group-positions";

interface PositionRowProps {
  group: GroupedPosition;
  initialLoad: boolean;
}

export const PositionRow = ({ group, initialLoad }: PositionRowProps) => {
  const [expanded, setExpanded] = useState(false);
  const ticker = usePricesStore((s) => s.prices[group.symbol]);

  if (!ticker && initialLoad) return <PositionRowSkeleton group={group} />;

  const base = group.symbol.slice(0, -group.quote.length);
  const currentPrice = ticker?.price ?? group.avgBuyPrice;
  const currentValue = currentPrice * group.totalQty;
  const pnl = currentValue - group.totalCost;
  const pnlPct = group.totalCost > 0 ? (pnl / group.totalCost) * 100 : 0;
  const up = pnl >= 0;

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
              {base}/{group.quote} · {group.transactions.length}{" "}
              {group.transactions.length === 1 ? "buy" : "buys"}
            </p>
          </div>
        </div>
        <span className={styles.cellSecondary}>{group.totalQty}</span>
        <span className={styles.cellSecondary}>${formatPrice(group.avgBuyPrice)}</span>
        <span className={styles.cellPrimary}>${formatPrice(currentPrice)}</span>
        <span className={cn(styles.pnlCell, up ? "text-price-up" : "text-price-down")}>
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {up ? "+" : ""}${formatPrice(Math.abs(pnl))}
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
