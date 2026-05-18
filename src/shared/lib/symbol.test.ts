import { describe, it, expect } from "vitest";
import { stripQuote, swapQuote } from "./symbol";

describe("stripQuote", () => {
  it("removes the quote suffix when present", () => {
    expect(stripQuote("BTCUSDT", "USDT")).toBe("BTC");
    expect(stripQuote("ETHUSDC", "USDC")).toBe("ETH");
  });

  it("returns the symbol unchanged when the quote does not match", () => {
    expect(stripQuote("BTCUSDT", "USDC")).toBe("BTCUSDT");
  });

  it("handles multi-character bases and uncommon quotes", () => {
    expect(stripQuote("DOGEUSDT", "USDT")).toBe("DOGE");
    expect(stripQuote("SHIBBTC", "BTC")).toBe("SHIB");
  });
});

describe("swapQuote", () => {
  it("replaces the trailing quote with a different one", () => {
    expect(swapQuote("BTCUSDT", "USDT", "USDC")).toBe("BTCUSDC");
  });

  it("appends new quote when old quote does not match (caller decides whether to validate)", () => {
    // Defensive: stripQuote leaves symbol intact, swap then appends.
    expect(swapQuote("BTCUSDT", "EUR", "USDC")).toBe("BTCUSDTUSDC");
  });
});
