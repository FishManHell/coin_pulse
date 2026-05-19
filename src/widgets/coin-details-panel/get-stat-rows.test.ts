import { describe, it, expect } from "vitest";
import { makeCoinTicker } from "@/test/fixtures";
import { getStatRows } from "./get-stat-rows";

describe("getStatRows", () => {
  it("emits four rows in fixed order: high, low, volume, change", () => {
    const rows = getStatRows(makeCoinTicker());
    expect(rows.map((r) => r.labelKey)).toEqual(["high24h", "low24h", "volume24h", "priceChange"]);
  });

  it("formats high/low as $-prefixed prices and tags them with up/down colors", () => {
    const [high, low] = getStatRows(makeCoinTicker());
    expect(high.value).toBe("$68,000.00");
    expect(high.valueClass).toBe("text-price-up");
    expect(low.value).toBe("$66,500.00");
    expect(low.valueClass).toBe("text-price-down");
  });

  it("computes 24h volume as quote-value (volume * price), formatted with K/M/B suffix", () => {
    // 12345.6789 BTC * $67000 = ~$827,160,486 → $827.16M
    expect(getStatRows(makeCoinTicker())[2].value).toBe("$827.16M");
  });

  it("tags positive price change as up and prefixes '+'", () => {
    const [, , , change] = getStatRows(makeCoinTicker({ priceChange: 1234.56, priceChangePercent: 1.87 }));
    expect(change.value).toBe("+1,234.56");
    expect(change.valueClass).toBe("text-price-up");
  });

  it("tags negative price change as down with the bare minus sign", () => {
    const [, , , change] = getStatRows(makeCoinTicker({ priceChange: -543.21, priceChangePercent: -0.81 }));
    // formatPrice's branches are not abs-aware: any value below 1 (including
    // negatives) falls into the 8-decimal branch. Documented here so a future
    // formatter rework that pulls negatives into the "≥ 1" branch breaks loudly.
    expect(change.value).toBe("-543.21000000");
    expect(change.valueClass).toBe("text-price-down");
  });

  it("treats exactly-flat (0%) as up — colors stay green at the boundary", () => {
    const [, , , change] = getStatRows(makeCoinTicker({ priceChange: 0, priceChangePercent: 0 }));
    expect(change.valueClass).toBe("text-price-up");
  });
});
