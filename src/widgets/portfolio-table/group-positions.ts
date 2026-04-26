import type { PortfolioPosition } from "@/shared/types";

export type GroupedPosition = {
  symbol: string;
  name: string;
  totalQty: number;
  totalCost: number;
  avgBuyPrice: number;
  transactions: PortfolioPosition[];
};

export const groupPositions = (positions: PortfolioPosition[]): GroupedPosition[] => {
  const map = new Map<string, PortfolioPosition[]>();
  for (const p of positions) {
    const arr = map.get(p.symbol) ?? [];
    arr.push(p);
    map.set(p.symbol, arr);
  }

  return Array.from(map.entries()).map(([symbol, txs]) => {
    const sorted = [...txs].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const totalQty = txs.reduce((s, t) => s + t.quantity, 0);
    const totalCost = txs.reduce((s, t) => s + t.quantity * t.buyPrice, 0);
    return {
      symbol,
      name: sorted[0].name,
      totalQty,
      totalCost,
      avgBuyPrice: totalQty > 0 ? totalCost / totalQty : 0,
      transactions: sorted,
    };
  });
};
