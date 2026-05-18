// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePriceFlash } from "./use-price-flash";

describe("usePriceFlash", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns null on the initial render (no prior price to compare)", () => {
    const { result } = renderHook(() => usePriceFlash(100));
    expect(result.current).toBe(null);
  });

  it("flashes 'up' when the price increases", () => {
    const { result, rerender } = renderHook(({ p }) => usePriceFlash(p), {
      initialProps: { p: 100 },
    });
    rerender({ p: 101 });
    expect(result.current).toBe("up");
  });

  it("flashes 'down' when the price decreases", () => {
    const { result, rerender } = renderHook(({ p }) => usePriceFlash(p), {
      initialProps: { p: 100 },
    });
    rerender({ p: 99 });
    expect(result.current).toBe("down");
  });

  it("does not flash when the price is unchanged", () => {
    const { result, rerender } = renderHook(({ p }) => usePriceFlash(p), {
      initialProps: { p: 100 },
    });
    rerender({ p: 100 });
    expect(result.current).toBe(null);
  });

  it("clears the flash back to null after 600ms", () => {
    const { result, rerender } = renderHook(({ p }) => usePriceFlash(p), {
      initialProps: { p: 100 },
    });
    rerender({ p: 101 });
    expect(result.current).toBe("up");
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(result.current).toBe(null);
  });

  it("compares against the latest seen price, not the initial one", () => {
    const { result, rerender } = renderHook(({ p }) => usePriceFlash(p), {
      initialProps: { p: 100 },
    });
    rerender({ p: 110 });
    expect(result.current).toBe("up");
    rerender({ p: 105 });
    expect(result.current).toBe("down");
  });
});
