import { describe, it, expect } from "vitest";
import { makePortfolioPosition } from "@/test/fixtures";
import { groupPositions } from "./group-positions";

describe("groupPositions", () => {
  it("returns an empty array for an empty input", () => {
    expect(groupPositions([])).toEqual([]);
  });

  it("aggregates quantity, cost, and weighted avg buy price across same-symbol rows", () => {
    const result = groupPositions([
      makePortfolioPosition({ id: "1", quantity: 1, buyPrice: 100 }),
      makePortfolioPosition({ id: "2", quantity: 3, buyPrice: 200 }),
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].symbol).toBe("BTCUSDT");
    expect(result[0].totalQty).toBe(4);
    expect(result[0].totalCost).toBe(700);
    // weighted avg: (1*100 + 3*200) / 4 = 175
    expect(result[0].avgBuyPrice).toBe(175);
  });

  it("orders transactions inside a group newest-first by createdAt", () => {
    const result = groupPositions([
      makePortfolioPosition({ id: "old", createdAt: "2026-01-01T00:00:00.000Z" }),
      makePortfolioPosition({ id: "new", createdAt: "2026-03-01T00:00:00.000Z" }),
      makePortfolioPosition({ id: "mid", createdAt: "2026-02-01T00:00:00.000Z" }),
    ]);

    expect(result[0].transactions.map((t) => t.id)).toEqual(["new", "mid", "old"]);
  });

  it("sources name/quote from the most recent transaction in the group", () => {
    const result = groupPositions([
      makePortfolioPosition({ id: "old", name: "OldName", quote: "USDC", createdAt: "2026-01-01T00:00:00.000Z" }),
      makePortfolioPosition({ id: "new", name: "NewName", quote: "USDT", createdAt: "2026-03-01T00:00:00.000Z" }),
    ]);

    expect(result[0].name).toBe("NewName");
    expect(result[0].quote).toBe("USDT");
  });

  it("keeps different symbols in separate groups", () => {
    const result = groupPositions([
      makePortfolioPosition({ id: "1", symbol: "BTCUSDT" }),
      makePortfolioPosition({ id: "2", symbol: "ETHUSDT" }),
    ]);

    expect(result).toHaveLength(2);
    const symbols = result.map((g) => g.symbol).sort();
    expect(symbols).toEqual(["BTCUSDT", "ETHUSDT"]);
  });

  it("yields avgBuyPrice=0 when totalQty=0 (defensive: shouldn't happen but guarded)", () => {
    const result = groupPositions([
      makePortfolioPosition({ id: "1", quantity: 0, buyPrice: 100 }),
    ]);
    expect(result[0].avgBuyPrice).toBe(0);
  });
});
