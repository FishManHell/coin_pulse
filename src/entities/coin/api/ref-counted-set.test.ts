import { describe, it, expect } from "vitest";
import { RefCountedSet } from "./ref-counted-set";

describe("RefCountedSet", () => {
  it("starts empty", () => {
    const set = new RefCountedSet<string>();
    expect(set.size).toBe(0);
    expect(set.keys()).toEqual([]);
  });

  it("adds an item on first increment", () => {
    const set = new RefCountedSet<string>();
    set.increment(["BTCUSDT"]);
    expect(set.size).toBe(1);
    expect(set.keys()).toEqual(["BTCUSDT"]);
  });

  it("keeps size 1 when the same item is incremented twice", () => {
    const set = new RefCountedSet<string>();
    set.increment(["BTCUSDT"]);
    set.increment(["BTCUSDT"]);
    expect(set.size).toBe(1);
    expect(set.keys()).toEqual(["BTCUSDT"]);
  });

  it("retains the item until the last reference is removed", () => {
    const set = new RefCountedSet<string>();
    set.increment(["BTCUSDT", "BTCUSDT"]);
    set.decrement(["BTCUSDT"]);
    expect(set.keys()).toEqual(["BTCUSDT"]);
    set.decrement(["BTCUSDT"]);
    expect(set.keys()).toEqual([]);
  });

  it("does not go negative when decrementing an unknown item", () => {
    const set = new RefCountedSet<string>();
    set.decrement(["NEVER_ADDED"]);
    expect(set.size).toBe(0);
    set.increment(["BTCUSDT"]);
    set.decrement(["BTCUSDT"]);
    set.decrement(["BTCUSDT"]);
    expect(set.size).toBe(0);
  });

  it("handles batches with mixed new and existing items", () => {
    const set = new RefCountedSet<string>();
    set.increment(["BTCUSDT", "ETHUSDT"]);
    set.increment(["ETHUSDT", "BNBUSDT"]);
    expect(set.keys()).toEqual(["BTCUSDT", "ETHUSDT", "BNBUSDT"]);
    set.decrement(["ETHUSDT"]);
    expect(set.keys()).toEqual(["BTCUSDT", "ETHUSDT", "BNBUSDT"]);
    set.decrement(["ETHUSDT", "BTCUSDT", "BNBUSDT"]);
    expect(set.keys()).toEqual([]);
  });

  it("is generic over key type", () => {
    const set = new RefCountedSet<number>();
    set.increment([1, 2, 2]);
    expect(set.keys()).toEqual([1, 2]);
    set.decrement([2]);
    expect(set.keys()).toEqual([1, 2]);
    set.decrement([2]);
    expect(set.keys()).toEqual([1]);
  });
});
