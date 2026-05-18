import type { GroupedPosition } from "./group-positions";

export interface PositionPnl {
  currentPrice: number;
  currentValue: number;
  pnl: number;
  pnlPct: number;
  isUp: boolean;
}

export const computePositionPnl = (
  group: GroupedPosition,
  livePrice: number | undefined,
): PositionPnl => {
  const currentPrice = livePrice ?? group.avgBuyPrice;
  const currentValue = currentPrice * group.totalQty;
  const pnl = currentValue - group.totalCost;
  const pnlPct = group.totalCost > 0 ? (pnl / group.totalCost) * 100 : 0;
  return { currentPrice, currentValue, pnl, pnlPct, isUp: pnl >= 0 };
};
