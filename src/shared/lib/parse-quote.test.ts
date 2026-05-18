import { describe, it, expect } from "vitest";
import { parseQuoteFromSymbol } from "./parse-quote";

describe("parseQuoteFromSymbol", () => {
  it("detects USDT-quoted pairs from the suffix", () => {
    expect(parseQuoteFromSymbol("BTCUSDT")).toBe("USDT");
    expect(parseQuoteFromSymbol("ETHUSDT")).toBe("USDT");
  });

  it("detects USDC-quoted pairs from the suffix", () => {
    expect(parseQuoteFromSymbol("BTCUSDC")).toBe("USDC");
  });

  it("falls back to USDT when symbol matches no known quote", () => {
    expect(parseQuoteFromSymbol("BTCBNB")).toBe("USDT");
  });

  it("respects an explicit fallback when the known list misses", () => {
    expect(parseQuoteFromSymbol("BTCBNB", "USDC")).toBe("USDC");
  });

  it("does not match when the symbol IS the quote (length guard)", () => {
    // A symbol that's literally "USDT" shouldn't be parsed as quote=USDT
    // with empty base — fall through to fallback instead.
    expect(parseQuoteFromSymbol("USDT")).toBe("USDT");
    expect(parseQuoteFromSymbol("USDC", "BNB")).toBe("BNB");
  });
});
