import { describe, it, expect } from "vitest";
import { diffSymbols } from "./diff-symbols";

describe("diffSymbols", () => {
  it("returns empty add/remove when both lists are empty", () => {
    expect(diffSymbols([], [])).toEqual({ add: [], remove: [] });
  });

  it("returns empty add/remove when lists are identical", () => {
    expect(diffSymbols(["BTCUSDT", "ETHUSDT"], ["BTCUSDT", "ETHUSDT"])).toEqual({
      add: [],
      remove: [],
    });
  });

  it("detects added symbols when next extends prev", () => {
    expect(diffSymbols(["BTCUSDT"], ["BTCUSDT", "ETHUSDT"])).toEqual({
      add: ["ETHUSDT"],
      remove: [],
    });
  });

  it("detects removed symbols when prev contains extras", () => {
    expect(diffSymbols(["BTCUSDT", "ETHUSDT"], ["ETHUSDT"])).toEqual({
      add: [],
      remove: ["BTCUSDT"],
    });
  });

  it("detects add and remove together on a full swap", () => {
    expect(diffSymbols(["BTCUSDT", "ETHUSDT"], ["BNBUSDT", "SOLUSDT"])).toEqual({
      add: ["BNBUSDT", "SOLUSDT"],
      remove: ["BTCUSDT", "ETHUSDT"],
    });
  });

  it("treats prev as empty (cold start) → everything is added", () => {
    expect(diffSymbols([], ["BTCUSDT", "ETHUSDT"])).toEqual({
      add: ["BTCUSDT", "ETHUSDT"],
      remove: [],
    });
  });

  it("treats next as empty (full teardown) → everything is removed", () => {
    expect(diffSymbols(["BTCUSDT", "ETHUSDT"], [])).toEqual({
      add: [],
      remove: ["BTCUSDT", "ETHUSDT"],
    });
  });

  it("ignores input ordering — diff is a set operation", () => {
    expect(diffSymbols(["ETHUSDT", "BTCUSDT"], ["BTCUSDT", "ETHUSDT", "BNBUSDT"])).toEqual({
      add: ["BNBUSDT"],
      remove: [],
    });
  });
});
