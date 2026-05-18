import { describe, it, expect, beforeEach } from "vitest";
import { makePortfolioPosition } from "@/test/fixtures";
import { usePortfolioStore } from "./store";

describe("usePortfolioStore", () => {
  beforeEach(() => {
    usePortfolioStore.setState({ positions: [] }, false);
  });

  it("starts with an empty positions array", () => {
    expect(usePortfolioStore.getState().positions).toEqual([]);
  });

  it("replaces positions wholesale on setPositions", () => {
    const positions = [
      makePortfolioPosition({ symbol: "BTCUSDT" }),
      makePortfolioPosition({ symbol: "ETHUSDT" }),
    ];
    usePortfolioStore.getState().setPositions(positions);
    expect(usePortfolioStore.getState().positions).toEqual(positions);
  });

  it("clears positions when setPositions is called with []", () => {
    usePortfolioStore.getState().setPositions([makePortfolioPosition({ symbol: "BTCUSDT" })]);
    usePortfolioStore.getState().setPositions([]);
    expect(usePortfolioStore.getState().positions).toEqual([]);
  });
});
