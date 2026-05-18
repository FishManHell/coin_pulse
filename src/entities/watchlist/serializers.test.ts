import { describe, it, expect } from "vitest";
import { Types } from "mongoose";
import { makeWatchlistItemLean } from "@/test/fixtures";
import { toWatchlistDTO } from "./serializers";

describe("toWatchlistDTO", () => {
  const baseId = new Types.ObjectId();
  const isoAddedAt = "2026-04-01T10:30:00.000Z";

  it("converts a fully-populated Lean doc into the DTO shape", () => {
    const dto = toWatchlistDTO(
      makeWatchlistItemLean({ _id: baseId, addedAt: new Date(isoAddedAt) }),
    );

    expect(dto).toEqual({
      id: baseId.toString(),
      symbol: "BTCUSDT",
      name: "Bitcoin",
      quote: "USDT",
      addedAt: isoAddedAt,
    });
  });

  it("accepts a string _id (already serialized) without re-converting", () => {
    const dto = toWatchlistDTO(
      makeWatchlistItemLean({
        _id: "abc123",
        symbol: "ETHUSDC",
        name: "Ethereum",
        quote: "USDC",
        addedAt: isoAddedAt,
      }),
    );
    expect(dto.id).toBe("abc123");
  });

  it("backfills quote from the symbol when the legacy row lacks one", () => {
    const dto = toWatchlistDTO(
      makeWatchlistItemLean({ symbol: "BTCUSDT", quote: undefined, addedAt: isoAddedAt }),
    );
    expect(dto.quote).toBe("USDT");
  });

  it("backfills quote=USDC from the symbol suffix", () => {
    const dto = toWatchlistDTO(
      makeWatchlistItemLean({ symbol: "BTCUSDC", quote: undefined, addedAt: isoAddedAt }),
    );
    expect(dto.quote).toBe("USDC");
  });

  it("returns the addedAt string as-is when it's already a string", () => {
    const dto = toWatchlistDTO(makeWatchlistItemLean({ addedAt: isoAddedAt }));
    expect(dto.addedAt).toBe(isoAddedAt);
  });
});
