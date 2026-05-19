import { describe, it, expect } from "vitest";
import { parsePortfolioPayload } from "./parse-payload";

const valid = {
  symbol: "BTCUSDT",
  name: "Bitcoin",
  quote: "USDT",
  quantity: 0.5,
  buyPrice: 65000,
};

describe("parsePortfolioPayload — happy path", () => {
  it("accepts a well-formed body and returns normalized numeric fields", () => {
    const r = parsePortfolioPayload(valid);
    expect(r).toEqual({
      ok: true,
      data: { symbol: "BTCUSDT", name: "Bitcoin", quote: "USDT", quantity: 0.5, buyPrice: 65000 },
    });
  });

  it("coerces stringified numbers (form input arrives as string)", () => {
    const r = parsePortfolioPayload({ ...valid, quantity: "0.5", buyPrice: "65000" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.quantity).toBe(0.5);
      expect(r.data.buyPrice).toBe(65000);
    }
  });

  it("backfills quote from the symbol when caller omits it", () => {
    const r = parsePortfolioPayload({ ...valid, quote: undefined });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.quote).toBe("USDT");
  });
});

describe("parsePortfolioPayload — shape errors", () => {
  it("rejects null and non-objects", () => {
    expect(parsePortfolioPayload(null)).toEqual({ ok: false, error: "portfolio.invalidPayload" });
    expect(parsePortfolioPayload(undefined)).toEqual({ ok: false, error: "portfolio.invalidPayload" });
    expect(parsePortfolioPayload("nope")).toEqual({ ok: false, error: "portfolio.invalidPayload" });
    expect(parsePortfolioPayload(42)).toEqual({ ok: false, error: "portfolio.invalidPayload" });
  });

  it("rejects non-string quote (when present)", () => {
    expect(parsePortfolioPayload({ ...valid, quote: 42 })).toEqual({
      ok: false,
      error: "portfolio.invalidQuote",
    });
  });
});

describe("parsePortfolioPayload — required fields", () => {
  it("rejects missing or empty symbol", () => {
    expect(parsePortfolioPayload({ ...valid, symbol: "" }).ok).toBe(false);
    expect(parsePortfolioPayload({ ...valid, symbol: undefined }).ok).toBe(false);
  });

  it("rejects missing or empty name", () => {
    expect(parsePortfolioPayload({ ...valid, name: "" }).ok).toBe(false);
    expect(parsePortfolioPayload({ ...valid, name: undefined }).ok).toBe(false);
  });

  it("rejects non-string symbol/name even if truthy", () => {
    expect(parsePortfolioPayload({ ...valid, symbol: 1 }).ok).toBe(false);
    expect(parsePortfolioPayload({ ...valid, name: true }).ok).toBe(false);
  });
});

describe("parsePortfolioPayload — numeric guards", () => {
  it("rejects non-finite quantity or price", () => {
    expect(parsePortfolioPayload({ ...valid, quantity: NaN }).ok).toBe(false);
    expect(parsePortfolioPayload({ ...valid, quantity: Infinity }).ok).toBe(false);
    expect(parsePortfolioPayload({ ...valid, buyPrice: "not-a-number" }).ok).toBe(false);
  });

  it("rejects zero and negative quantity or price (positive-only)", () => {
    expect(parsePortfolioPayload({ ...valid, quantity: 0 }).ok).toBe(false);
    expect(parsePortfolioPayload({ ...valid, quantity: -1 }).ok).toBe(false);
    expect(parsePortfolioPayload({ ...valid, buyPrice: 0 }).ok).toBe(false);
    expect(parsePortfolioPayload({ ...valid, buyPrice: -100 }).ok).toBe(false);
  });

  it("surfaces a single error code for numeric problems", () => {
    expect(parsePortfolioPayload({ ...valid, quantity: -1 })).toEqual({
      ok: false,
      error: "portfolio.positiveNumbersRequired",
    });
  });
});
