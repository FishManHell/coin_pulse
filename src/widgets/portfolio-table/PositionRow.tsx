"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { useAppStore } from "@/shared/store";
import { useRemoveFromPortfolio } from "@/features/remove-from-portfolio";
import { formatPrice, formatPercent, cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { styles } from "./styles";
import type { GroupedPosition } from "./group-positions";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
});

type Props = { group: GroupedPosition };

export const PositionRow = ({ group }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const prices = useAppStore((s) => s.prices);
  const { remove, loading: removing } = useRemoveFromPortfolio();

  const currentPrice = prices[group.symbol]?.price ?? group.avgBuyPrice;
  const currentValue = currentPrice * group.totalQty;
  const pnl = currentValue - group.totalCost;
  const pnlPct = group.totalCost > 0 ? (pnl / group.totalCost) * 100 : 0;
  const up = pnl >= 0;

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    remove(id);
  };

  return (
    <>
      <div
        className={styles.row}
        onClick={() => setExpanded((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpanded((v) => !v); } }}
      >
        <span className={styles.expandIcon}>
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
        <div className="flex items-center gap-3">
          <div className={styles.avatar}>{group.name[0]}</div>
          <div>
            <p className={styles.assetName}>{group.name}</p>
            <p className={styles.assetTicker}>
              {group.symbol.replace("USDT", "")} · {group.transactions.length} {group.transactions.length === 1 ? "buy" : "buys"}
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
            <div key={tx.id} className={styles.txRow}>
              <span />
              <span className={styles.txDate}>{dateFmt.format(new Date(tx.createdAt))}</span>
              <span className={styles.txValue}>{tx.quantity}</span>
              <span className={styles.txValue}>${formatPrice(tx.buyPrice)}</span>
              <span />
              <span />
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => handleDelete(e, tx.id)}
                disabled={removing}
                aria-label="Delete transaction"
                className="text-text-muted hover:text-price-down hover:bg-price-down/10"
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
