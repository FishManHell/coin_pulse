import { describe, it, expect } from "vitest";
import type { CoinMeta } from "@/entities/coin";
import { deriveEffectiveSymbol } from "./derive-effective-symbol";

const pairs: CoinMeta[] = [
  { symbol: "BTCUSDT", name: "Bitcoin" },
  { symbol: "ETHUSDT", name: "Ethereum" },
  { symbol: "SOLUSDT", name: "Solana" },
];

describe("deriveEffectiveSymbol", () => {
  it("returns an empty string when there are no pairs (regardless of user input)", () => {
    expect(deriveEffectiveSymbol("BTCUSDT", [])).toBe("");
    expect(deriveEffectiveSymbol("", [])).toBe("");
  });

  it("keeps the user's symbol when it is still present in the pair list", () => {
    expect(deriveEffectiveSymbol("ETHUSDT", pairs)).toBe("ETHUSDT");
  });

  it("falls back to the first pair when the user's symbol no longer matches any pair", () => {
    expect(deriveEffectiveSymbol("DOGEUSDT", pairs)).toBe("BTCUSDT");
  });

  it("falls back to the first pair when the user has not chosen anything yet", () => {
    expect(deriveEffectiveSymbol("", pairs)).toBe("BTCUSDT");
  });
});
