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
  it("returns an empty byQuote list when there are no groups", () => {
    const r = computePortfolioPnl([], {});
    expect(r.byQuote).toEqual([]);
  });

  it("aggregates a single quote into one entry", () => {
    const groups = [
      makeGroup({ symbol: "BTCUSDT", totalQty: 2, totalCost: 100_000, avgBuyPrice: 50_000 }),
      makeGroup({ symbol: "ETHUSDT", totalQty: 10, totalCost: 30_000, avgBuyPrice: 3_000 }),
    ];
    const r = computePortfolioPnl(groups, { BTCUSDT: 60_000, ETHUSDT: 3_500 });
    expect(r.byQuote).toHaveLength(1);
    const usdt = r.byQuote[0];
    expect(usdt.quote).toBe("USDT");
    expect(usdt.invested).toBe(130_000);
    expect(usdt.current).toBe(155_000);
    expect(usdt.pnl).toBe(25_000);
    expect(usdt.pnlPct).toBeCloseTo((25_000 / 130_000) * 100);
    expect(usdt.isUp).toBe(true);
  });

  it("falls back to avgBuyPrice for groups whose symbol has no live price", () => {
    const groups = [
      makeGroup({ symbol: "BTCUSDT", totalQty: 2, totalCost: 100_000, avgBuyPrice: 50_000 }),
      makeGroup({ symbol: "ETHUSDT", totalQty: 10, totalCost: 30_000, avgBuyPrice: 3_000 }),
    ];
    const r = computePortfolioPnl(groups, { BTCUSDT: 60_000 });
    const usdt = r.byQuote[0];
    expect(usdt.invested).toBe(130_000);
    expect(usdt.current).toBe(150_000);
    expect(usdt.pnl).toBe(20_000);
    expect(usdt.isUp).toBe(true);
  });

  it("reports a per-quote loss when current drops below invested", () => {
    const groups = [makeGroup({ totalQty: 2, totalCost: 100_000, avgBuyPrice: 50_000 })];
    const r = computePortfolioPnl(groups, { BTCUSDT: 40_000 });
    const usdt = r.byQuote[0];
    expect(usdt.pnl).toBe(-20_000);
    expect(usdt.pnlPct).toBe(-20);
    expect(usdt.isUp).toBe(false);
  });

  it("guards pnlPct against division by zero when a quote's invested is 0", () => {
    const groups = [makeGroup({ totalQty: 0, totalCost: 0, avgBuyPrice: 0 })];
    const r = computePortfolioPnl(groups, { BTCUSDT: 60_000 });
    const usdt = r.byQuote[0];
    expect(usdt.invested).toBe(0);
    expect(usdt.pnlPct).toBe(0);
    expect(Number.isFinite(usdt.pnlPct)).toBe(true);
  });

  it("splits totals across multiple quotes and ranks USDT first", () => {
    const groups = [
      makeGroup({ symbol: "BTCBUSD", quote: "BUSD", totalQty: 1, totalCost: 30_000, avgBuyPrice: 30_000 }),
      makeGroup({ symbol: "BTCUSDT", quote: "USDT", totalQty: 1, totalCost: 50_000, avgBuyPrice: 50_000 }),
      makeGroup({ symbol: "ETHEUR", quote: "EUR", totalQty: 2, totalCost: 4_000, avgBuyPrice: 2_000 }),
    ];
    const r = computePortfolioPnl(groups, {
      BTCBUSD: 35_000,
      BTCUSDT: 60_000,
      ETHEUR: 2_500,
    });
    expect(r.byQuote.map((q) => q.quote)).toEqual(["USDT", "BUSD", "EUR"]);
    const [usdt, busd, eur] = r.byQuote;
    expect(usdt.invested).toBe(50_000);
    expect(usdt.current).toBe(60_000);
    expect(busd.invested).toBe(30_000);
    expect(busd.current).toBe(35_000);
    expect(eur.invested).toBe(4_000);
    expect(eur.current).toBe(5_000);
  });
});
