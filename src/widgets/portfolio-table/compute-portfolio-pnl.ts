import type { GroupedPosition } from "./group-positions";

export interface PortfolioPnl {
  invested: number;
  current: number;
  pnl: number;
  pnlPct: number;
  isUp: boolean;
}

export const computePortfolioPnl = (
  groups: GroupedPosition[],
  prices: Record<string, number | undefined>,
): PortfolioPnl => {
  const invested = groups.reduce((sum, g) => sum + g.totalCost, 0);
  const current = groups.reduce((sum, g) => {
    const price = prices[g.symbol] ?? g.avgBuyPrice;
    return sum + g.totalQty * price;
  }, 0);
  const pnl = current - invested;
  const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;
  return { invested, current, pnl, pnlPct, isUp: pnl >= 0 };
};
