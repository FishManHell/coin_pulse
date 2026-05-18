import { describe, it, expect } from "vitest";
import { Types } from "mongoose";
import { makePortfolioPositionLean } from "@/test/fixtures";
import { toPortfolioDTO } from "./serializers";

describe("toPortfolioDTO", () => {
  const baseId = new Types.ObjectId();
  const isoCreatedAt = "2026-04-01T10:30:00.000Z";

  it("converts a fully-populated Lean doc into the DTO shape", () => {
    const dto = toPortfolioDTO(
      makePortfolioPositionLean({
        _id: baseId,
        quantity: 0.5,
        buyPrice: 65000,
        createdAt: new Date(isoCreatedAt),
      }),
    );

    expect(dto).toEqual({
      id: baseId.toString(),
      symbol: "BTCUSDT",
      name: "Bitcoin",
      quote: "USDT",
      quantity: 0.5,
      buyPrice: 65000,
      createdAt: isoCreatedAt,
    });
  });

  it("backfills quote from the symbol when the legacy row lacks one", () => {
    const dto = toPortfolioDTO(
      makePortfolioPositionLean({
        symbol: "ETHUSDC",
        name: "Ethereum",
        quote: undefined,
        quantity: 2,
        buyPrice: 3500,
        createdAt: isoCreatedAt,
      }),
    );
    expect(dto.quote).toBe("USDC");
  });

  it("preserves numeric quantity and buyPrice as-is (no rounding/clamping)", () => {
    const dto = toPortfolioDTO(
      makePortfolioPositionLean({
        quantity: 0.00012345,
        buyPrice: 67250.456789,
        createdAt: isoCreatedAt,
      }),
    );
    expect(dto.quantity).toBe(0.00012345);
    expect(dto.buyPrice).toBe(67250.456789);
  });

  it("returns createdAt unchanged when it's already an ISO string", () => {
    const dto = toPortfolioDTO(makePortfolioPositionLean({ createdAt: isoCreatedAt }));
    expect(dto.createdAt).toBe(isoCreatedAt);
  });
});
