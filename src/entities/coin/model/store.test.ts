import { describe, it, expect, beforeEach } from "vitest";
import { makeCoinTicker } from "@/test/fixtures";
import { usePricesStore } from "./store";

describe("usePricesStore", () => {
  beforeEach(() => {
    usePricesStore.setState({ prices: {} }, false);
  });

  it("starts with an empty prices map", () => {
    expect(usePricesStore.getState().prices).toEqual({});
  });

  it("inserts a ticker keyed by symbol", () => {
    const btc = makeCoinTicker({ symbol: "BTCUSDT", price: 67000 });
    usePricesStore.getState().updatePrice(btc);
    expect(usePricesStore.getState().prices).toEqual({ BTCUSDT: btc });
  });

  it("replaces the ticker when the same symbol is updated again", () => {
    const first = makeCoinTicker({ symbol: "BTCUSDT", price: 67000 });
    const second = makeCoinTicker({ symbol: "BTCUSDT", price: 67500 });
    usePricesStore.getState().updatePrice(first);
    usePricesStore.getState().updatePrice(second);
    expect(usePricesStore.getState().prices).toEqual({ BTCUSDT: second });
  });

  it("merges multiple symbols without disturbing each other", () => {
    const btc = makeCoinTicker({ symbol: "BTCUSDT", price: 67000 });
    const eth = makeCoinTicker({ symbol: "ETHUSDT", price: 3500 });
    usePricesStore.getState().updatePrice(btc);
    usePricesStore.getState().updatePrice(eth);
    expect(usePricesStore.getState().prices).toEqual({ BTCUSDT: btc, ETHUSDT: eth });
  });

  it("produces a new prices object reference on each update (for selector identity)", () => {
    const before = usePricesStore.getState().prices;
    usePricesStore.getState().updatePrice(makeCoinTicker({ symbol: "BTCUSDT" }));
    const after = usePricesStore.getState().prices;
    expect(after).not.toBe(before);
  });
});
