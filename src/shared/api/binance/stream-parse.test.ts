import { describe, it, expect } from "vitest";
import { parseTicker, buildStreamUrl } from "./stream-parse";
import type { BinanceTickerEvent } from "./types";

describe("parseTicker", () => {
  const event: BinanceTickerEvent = {
    s: "BTCUSDT",
    c: "67250.45",
    p: "1234.56",
    P: "1.87",
    v: "12345.6789",
    h: "68000.00",
    l: "66500.10",
  };

  it("maps Binance ticker fields onto the domain CoinTicker shape", () => {
    expect(parseTicker(event)).toEqual({
      symbol: "BTCUSDT",
      price: 67250.45,
      priceChange: 1234.56,
      priceChangePercent: 1.87,
      volume: 12345.6789,
      high24h: 68000,
      low24h: 66500.1,
    });
  });

  it("parses negative price changes (24h downtrend)", () => {
    const result = parseTicker({ ...event, p: "-543.21", P: "-0.81" });
    expect(result.priceChange).toBe(-543.21);
    expect(result.priceChangePercent).toBe(-0.81);
  });

  it("parses zero values for fresh listings (no movement yet)", () => {
    const result = parseTicker({
      ...event,
      c: "0",
      p: "0",
      P: "0",
      v: "0",
      h: "0",
      l: "0",
    });
    expect(result.price).toBe(0);
    expect(result.volume).toBe(0);
  });
});

describe("buildStreamUrl", () => {
  it("lowercases symbols and joins them with slashes under the combined-stream path", () => {
    expect(buildStreamUrl(["BTCUSDT", "ETHUSDT"])).toBe(
      "wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker",
    );
  });

  it("handles a single symbol via the same combined-stream shape", () => {
    expect(buildStreamUrl(["BTCUSDT"])).toBe(
      "wss://stream.binance.com:9443/stream?streams=btcusdt@ticker",
    );
  });

  it("produces an empty streams param when given an empty list (caller guards this)", () => {
    expect(buildStreamUrl([])).toBe("wss://stream.binance.com:9443/stream?streams=");
  });
});
