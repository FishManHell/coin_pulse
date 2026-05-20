"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useShallow } from "zustand/react/shallow";
import { usePricesStore } from "@/entities/coin";
import { formatPercent } from "@/shared/lib/utils";
import type { GroupedPosition } from "./group-positions";
import { SummaryCard } from "./SummaryCard";
import { QuotedAmount } from "./QuotedAmount";
import { computePortfolioPnl, type QuotePnl } from "./compute-portfolio-pnl";

interface LiveSummaryCardsProps {
  grouped: GroupedPosition[];
  loading: boolean;
}

const PnlNode = ({ q }: { q: QuotePnl }) => (
  <>
    {q.isUp ? "+" : "-"}
    <QuotedAmount value={Math.abs(q.pnl)} quote={q.quote} />
    <span className="ml-1 text-xs opacity-70">({formatPercent(q.pnlPct)})</span>
  </>
);

const pnlColor = (q: QuotePnl) => (q.isUp ? "text-price-up" : "text-price-down");

export const LiveSummaryCards = ({ grouped, loading }: Readonly<LiveSummaryCardsProps>) => {
  const t = useTranslations("portfolio.summary");
  const symbols = useMemo(() => grouped.map((g) => g.symbol), [grouped]);

  // Subscribe shallow-equal to only the prices we actually consume — re-renders
  // skip when an unrelated symbol ticks AND when one of ours ticks but its
  // numeric price is unchanged.
  const prices = usePricesStore(
    useShallow((s) =>
      Object.fromEntries(symbols.map((sym) => [sym, s.prices[sym]?.price])),
    ),
  );

  const { byQuote } = computePortfolioPnl(grouped, prices);
  const [primary, ...rest] = byQuote;

  return (
    <>
      <SummaryCard
        label={t("currentValue")}
        value={<QuotedAmount value={primary.current} quote={primary.quote} />}
        color="text-text-primary"
        loading={loading}
        secondary={rest.map((q) => ({
          key: q.quote,
          node: <>+ <QuotedAmount value={q.current} quote={q.quote} /></>,
        }))}
      />
      <SummaryCard
        label={t("totalPnl")}
        value={<PnlNode q={primary} />}
        color={pnlColor(primary)}
        loading={loading}
        secondary={rest.map((q) => ({ key: q.quote, node: <PnlNode q={q} />, color: pnlColor(q) }))}
      />
    </>
  );
};
