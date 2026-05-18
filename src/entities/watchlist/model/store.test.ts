import { describe, it, expect, beforeEach } from "vitest";
import { makeWatchlistItem } from "@/test/fixtures";
import { useWatchlistStore } from "./store";

describe("useWatchlistStore", () => {
  beforeEach(() => {
    useWatchlistStore.setState({ items: [] }, false);
  });

  it("starts with an empty items array", () => {
    expect(useWatchlistStore.getState().items).toEqual([]);
  });

  it("replaces items wholesale on setItems", () => {
    const items = [
      makeWatchlistItem({ symbol: "BTCUSDT" }),
      makeWatchlistItem({ symbol: "ETHUSDT" }),
    ];
    useWatchlistStore.getState().setItems(items);
    expect(useWatchlistStore.getState().items).toEqual(items);
  });

  it("clears items when setItems is called with []", () => {
    useWatchlistStore.getState().setItems([makeWatchlistItem({ symbol: "BTCUSDT" })]);
    useWatchlistStore.getState().setItems([]);
    expect(useWatchlistStore.getState().items).toEqual([]);
  });
});
