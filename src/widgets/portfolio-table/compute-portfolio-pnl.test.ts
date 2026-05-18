import { describe, it, expect } from "vitest";
import { computePortfolioPnl } from "./compute-portfolio-pnl";
import type { GroupedPosition } from "./group-positions";

const makeGroup = (overrides: Partial<GroupedPosition> = {}): GroupedPosition => ({
  symbol: "BTCUSDT",
  name: "Bitcoin",
  quote: "USDT",
  totalQty: 2,
  totalCost: 100_000,
  avgBuyPrice: 50_000,
  transactions: [],
  ...overrides,
});

describe("computePortfolioPnl", () => {
  it("returns all-zero / isUp=true when there are no groups", () => {
    const r = computePortfolioPnl([], {});
    expect(r).toEqual({ invested: 0, current: 0, pnl: 0, pnlPct: 0, isUp: true });
  });

  it("aggregates invested and current across multiple priced groups", () => {
    const groups = [
      makeGroup({ symbol: "BTCUSDT", totalQty: 2, totalCost: 100_000, avgBuyPrice: 50_000 }),
      makeGroup({ symbol: "ETHUSDT", totalQty: 10, totalCost: 30_000, avgBuyPrice: 3_000 }),
    ];
    const r = computePortfolioPnl(groups, { BTCUSDT: 60_000, ETHUSDT: 3_500 });
    expect(r.invested).toBe(130_000);
    expect(r.current).toBe(155_000);
    expect(r.pnl).toBe(25_000);
    expect(r.pnlPct).toBeCloseTo((25_000 / 130_000) * 100);
    expect(r.isUp).toBe(true);
  });

  it("falls back to avgBuyPrice for groups whose symbol has no live price", () => {
    const groups = [
      makeGroup({ symbol: "BTCUSDT", totalQty: 2, totalCost: 100_000, avgBuyPrice: 50_000 }),
      makeGroup({ symbol: "ETHUSDT", totalQty: 10, totalCost: 30_000, avgBuyPrice: 3_000 }),
    ];
    const r = computePortfolioPnl(groups, { BTCUSDT: 60_000 });
    expect(r.invested).toBe(130_000);
    // ETH contributes 10 * 3000 (fallback) = 30000; BTC contributes 2 * 60000 = 120000
    expect(r.current).toBe(150_000);
    expect(r.pnl).toBe(20_000);
    expect(r.isUp).toBe(true);
  });

  it("reports a net loss when current value drops below invested", () => {
    const groups = [makeGroup({ totalQty: 2, totalCost: 100_000, avgBuyPrice: 50_000 })];
    const r = computePortfolioPnl(groups, { BTCUSDT: 40_000 });
    expect(r.pnl).toBe(-20_000);
    expect(r.pnlPct).toBe(-20);
    expect(r.isUp).toBe(false);
  });

  it("guards pnlPct against division by zero when invested is 0", () => {
    const groups = [
      makeGroup({ totalQty: 0, totalCost: 0, avgBuyPrice: 0 }),
    ];
    const r = computePortfolioPnl(groups, { BTCUSDT: 60_000 });
    expect(r.invested).toBe(0);
    expect(r.pnlPct).toBe(0);
    expect(Number.isFinite(r.pnlPct)).toBe(true);
  });
});
