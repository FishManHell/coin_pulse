"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/shared/store";
import { formatPrice, formatPercent } from "@/shared/lib/utils";
import type { GroupedPosition } from "./group-positions";
import { SummaryCard } from "./SummaryCard";

interface LiveSummaryCardsProps {
  grouped: GroupedPosition[];
  loading: boolean;
}

export const LiveSummaryCards = ({ grouped, loading }: Readonly<LiveSummaryCardsProps>) => {
  const symbols = useMemo(() => grouped.map((g) => g.symbol), [grouped]);

  // Subscribe shallow-equal to only the prices we actually consume — re-renders
  // skip when an unrelated symbol ticks AND when one of ours ticks but its
  // numeric price is unchanged.
  const prices = useAppStore(
    useShallow((s) =>
      Object.fromEntries(symbols.map((sym) => [sym, s.prices[sym]?.price])),
    ),
  );

  const invested = grouped.reduce((sum, g) => sum + g.totalCost, 0);
  const current = grouped.reduce((sum, g) => {
    const price = prices[g.symbol] ?? g.avgBuyPrice;
    return sum + g.totalQty * price;
  }, 0);
  const pnl = current - invested;
  const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;
  const isUp = pnl >= 0;

  return (
    <>
      <SummaryCard
        label="Current value"
        value={`$${formatPrice(current)}`}
        color="text-text-primary"
        loading={loading}
      />
      <SummaryCard
        label="Total P&L"
        value={`${isUp ? "+" : ""}$${formatPrice(Math.abs(pnl))} (${formatPercent(pnlPct)})`}
        color={isUp ? "text-price-up" : "text-price-down"}
        loading={loading}
      />
    </>
  );
};
