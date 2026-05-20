import type { GroupedPosition } from "./group-positions";

export interface QuotePnl {
  quote: string;
  invested: number;
  current: number;
  pnl: number;
  pnlPct: number;
  isUp: boolean;
}

export interface PortfolioPnl {
  byQuote: QuotePnl[];
}

const quoteSortRank = (quote: string): number => (quote === "USDT" ? 0 : 1);

export const computePortfolioPnl = (
  groups: GroupedPosition[],
  prices: Record<string, number | undefined>,
): PortfolioPnl => {
  const sums = new Map<string, { invested: number; current: number }>();
  for (const g of groups) {
    const acc = sums.get(g.quote) ?? { invested: 0, current: 0 };
    acc.invested += g.totalCost;
    const price = prices[g.symbol] ?? g.avgBuyPrice;
    acc.current += g.totalQty * price;
    sums.set(g.quote, acc);
  }
  const byQuote: QuotePnl[] = Array.from(sums.entries()).map(([quote, { invested, current }]) => {
    const pnl = current - invested;
    const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;
    return { quote, invested, current, pnl, pnlPct, isUp: pnl >= 0 };
  });
  byQuote.sort(
    (a, b) =>
      quoteSortRank(a.quote) - quoteSortRank(b.quote) || a.quote.localeCompare(b.quote),
  );
  return { byQuote };
};
