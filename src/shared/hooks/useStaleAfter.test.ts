// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useStaleAfter } from "./useStaleAfter";

describe("useStaleAfter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns false immediately after mount", () => {
    const { result } = renderHook(() => useStaleAfter("v1", 1000));
    expect(result.current).toBe(false);
  });

  it("flips to true after the configured delay elapses", () => {
    const { result } = renderHook(() => useStaleAfter("v1", 1000));
    expect(result.current).toBe(false);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(true);
  });

  it("does not flip before the delay", () => {
    const { result } = renderHook(() => useStaleAfter("v1", 1000));
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(result.current).toBe(false);
  });

  it("resets to false when the value changes mid-flight", () => {
    const { result, rerender } = renderHook(({ value }) => useStaleAfter(value, 1000), {
      initialProps: { value: "v1" },
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(true);

    rerender({ value: "v2" });
    expect(result.current).toBe(false);
  });

  it("starts a new timer for the replacement value", () => {
    const { result, rerender } = renderHook(({ value }) => useStaleAfter(value, 1000), {
      initialProps: { value: "v1" },
    });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    rerender({ value: "v2" });
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(result.current).toBe(false);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe(true);
  });
});
