import { describe, it, expect } from "vitest";
import { computePositionPnl } from "./compute-position-pnl";
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

describe("computePositionPnl", () => {
  it("uses the live price when one is supplied", () => {
    const r = computePositionPnl(makeGroup(), 60_000);
    expect(r.currentPrice).toBe(60_000);
    expect(r.currentValue).toBe(120_000);
    expect(r.pnl).toBe(20_000);
    expect(r.pnlPct).toBe(20);
    expect(r.isUp).toBe(true);
  });

  it("falls back to avgBuyPrice when the live price is undefined (gives pnl=0)", () => {
    const r = computePositionPnl(makeGroup(), undefined);
    expect(r.currentPrice).toBe(50_000);
    expect(r.currentValue).toBe(100_000);
    expect(r.pnl).toBe(0);
    expect(r.pnlPct).toBe(0);
    expect(r.isUp).toBe(true);
  });

  it("reports loss when the live price is below the average buy", () => {
    const r = computePositionPnl(makeGroup(), 40_000);
    expect(r.pnl).toBe(-20_000);
    expect(r.pnlPct).toBe(-20);
    expect(r.isUp).toBe(false);
  });

  it("treats a flat outcome (pnl === 0) as isUp=true", () => {
    const r = computePositionPnl(makeGroup(), 50_000);
    expect(r.pnl).toBe(0);
    expect(r.isUp).toBe(true);
  });

  it("guards pnlPct against division by zero when totalCost is 0", () => {
    const r = computePositionPnl(
      makeGroup({ totalCost: 0, avgBuyPrice: 0, totalQty: 0 }),
      60_000,
    );
    expect(r.pnlPct).toBe(0);
    expect(Number.isFinite(r.pnlPct)).toBe(true);
  });
});
