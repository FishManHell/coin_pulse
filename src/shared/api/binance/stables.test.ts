import { describe, it, expect, vi } from "vitest";
import type { MiniTicker } from "./types";

// Mock tradingPairs so the test universe is deterministic regardless of the
// generated pairs snapshot.
vi.mock("./pairs", () => ({
  tradingPairs: new Map<string, string>([
    ["BTCUSDT", "USDT"],
    ["BTCUSDC", "USDC"],
    ["BTCBNB", "BNB"],
    ["ETHTUSD", "TUSD"],
    ["USDCUSDT", "USDT"],
    ["BNBUSDT", "USDT"],
    ["TUSDUSDT", "USDT"],
  ]),
}));

const { buildStablecoinSet } = await import("./stables");

const ticker = (symbol: string, lastPrice: string): MiniTicker => ({
  symbol,
  lastPrice,
  quoteVolume: "0",
});

describe("buildStablecoinSet", () => {
  it("always includes USDT as the reference stable", () => {
    expect(buildStablecoinSet([])).toEqual(new Set(["USDT"]));
  });

  it("adds quote assets whose USDT pair sits inside [0.99, 1.01]", () => {
    const stables = buildStablecoinSet([
      ticker("USDCUSDT", "1.0001"),
      ticker("TUSDUSDT", "0.9985"),
      ticker("BNBUSDT", "612.34"),
    ]);
    expect(stables).toEqual(new Set(["USDT", "USDC", "TUSD"]));
  });

  it("rejects quote assets priced outside the peg window", () => {
    const stables = buildStablecoinSet([
      ticker("USDCUSDT", "1.05"),
      ticker("TUSDUSDT", "0.95"),
    ]);
    expect(stables).toEqual(new Set(["USDT"]));
  });

  it("includes pegs sitting exactly on the inclusive bounds", () => {
    const stables = buildStablecoinSet([
      ticker("USDCUSDT", "0.99"),
      ticker("TUSDUSDT", "1.01"),
    ]);
    expect(stables.has("USDC")).toBe(true);
    expect(stables.has("TUSD")).toBe(true);
  });

  it("ignores quote assets that have no USDT pair in the ticker list", () => {
    const stables = buildStablecoinSet([
      // No BNBUSDT row means BNB price is unknown — never added.
      ticker("USDCUSDT", "1.00"),
    ]);
    expect(stables.has("BNB")).toBe(false);
  });
});
