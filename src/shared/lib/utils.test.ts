import { describe, it, expect } from "vitest";
import { formatPrice, formatPercent, formatVolume } from "./utils";

describe("formatPrice", () => {
  it("uses 2-decimal thousands separator for prices ≥ 1000", () => {
    expect(formatPrice(67250.456)).toBe("67,250.46");
    expect(formatPrice(1000)).toBe("1,000.00");
  });

  it("uses 4 decimals for prices between 1 and 1000", () => {
    expect(formatPrice(123.4567)).toBe("123.4567");
    expect(formatPrice(1)).toBe("1.0000");
    expect(formatPrice(999.99999)).toBe("1000.0000");
  });

  it("uses 8 decimals for sub-dollar prices (long-tail tokens)", () => {
    expect(formatPrice(0.00001234)).toBe("0.00001234");
    expect(formatPrice(0.5)).toBe("0.50000000");
    expect(formatPrice(0)).toBe("0.00000000");
  });
});

describe("formatPercent", () => {
  it("prefixes positive values with '+' sign", () => {
    expect(formatPercent(1.87)).toBe("+1.87%");
    expect(formatPercent(0)).toBe("+0.00%");
  });

  it("uses the bare minus sign for negative values (no leading '+')", () => {
    expect(formatPercent(-0.81)).toBe("-0.81%");
  });

  it("rounds to 2 decimals", () => {
    expect(formatPercent(1.234567)).toBe("+1.23%");
    expect(formatPercent(-9.999)).toBe("-10.00%");
  });
});

describe("formatVolume", () => {
  it("uses B suffix for billions", () => {
    expect(formatVolume(2_500_000_000)).toBe("$2.50B");
  });

  it("uses M suffix for millions", () => {
    expect(formatVolume(12_500_000)).toBe("$12.50M");
  });

  it("uses K suffix for thousands", () => {
    expect(formatVolume(5_500)).toBe("$5.50K");
  });

  it("emits a bare dollar value under 1000", () => {
    expect(formatVolume(123.45)).toBe("$123.45");
    expect(formatVolume(0)).toBe("$0.00");
  });

  it("uses the higher suffix at exact thresholds (≥, not >)", () => {
    expect(formatVolume(1_000)).toBe("$1.00K");
    expect(formatVolume(1_000_000)).toBe("$1.00M");
    expect(formatVolume(1_000_000_000)).toBe("$1.00B");
  });
});
