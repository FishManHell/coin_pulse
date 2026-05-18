import { describe, it, expect, beforeEach } from "vitest";
import { useSelectionStore } from "./selection-store";

describe("useSelectionStore", () => {
  beforeEach(() => {
    useSelectionStore.setState({ selectedSymbol: "BTCUSDT", selectedQuote: "USDT" }, false);
  });

  it("defaults to BTCUSDT / USDT", () => {
    const state = useSelectionStore.getState();
    expect(state.selectedSymbol).toBe("BTCUSDT");
    expect(state.selectedQuote).toBe("USDT");
  });

  it("setSelectedSymbol updates symbol without touching quote", () => {
    useSelectionStore.getState().setSelectedSymbol("ETHUSDT");
    const state = useSelectionStore.getState();
    expect(state.selectedSymbol).toBe("ETHUSDT");
    expect(state.selectedQuote).toBe("USDT");
  });

  it("setSelectedQuote updates quote without touching symbol", () => {
    useSelectionStore.getState().setSelectedQuote("USDC");
    const state = useSelectionStore.getState();
    expect(state.selectedSymbol).toBe("BTCUSDT");
    expect(state.selectedQuote).toBe("USDC");
  });
});
