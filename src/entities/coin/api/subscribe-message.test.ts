import { describe, it, expect } from "vitest";
import { streamName, subscribeMessage, unsubscribeMessage } from "./subscribe-message";

describe("streamName", () => {
  it("lowercases symbol and suffixes @ticker", () => {
    expect(streamName("BTCUSDT")).toBe("btcusdt@ticker");
  });
});

describe("subscribeMessage", () => {
  it("builds a SUBSCRIBE frame with mapped stream names and the given id", () => {
    expect(subscribeMessage(["BTCUSDT", "ETHUSDT"], 7)).toEqual({
      method: "SUBSCRIBE",
      params: ["btcusdt@ticker", "ethusdt@ticker"],
      id: 7,
    });
  });

  it("handles a single-symbol subscribe (delta of size 1)", () => {
    expect(subscribeMessage(["BNBUSDT"], 1)).toEqual({
      method: "SUBSCRIBE",
      params: ["bnbusdt@ticker"],
      id: 1,
    });
  });
});

describe("unsubscribeMessage", () => {
  it("builds an UNSUBSCRIBE frame with mapped stream names and the given id", () => {
    expect(unsubscribeMessage(["BTCUSDT"], 12)).toEqual({
      method: "UNSUBSCRIBE",
      params: ["btcusdt@ticker"],
      id: 12,
    });
  });
});
