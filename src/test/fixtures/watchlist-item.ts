import { Types } from "mongoose";
import type { WatchlistItem, WatchlistItemLean } from "@/entities/watchlist";

export const makeWatchlistItem = (overrides: Partial<WatchlistItem> = {}): WatchlistItem => ({
  id: "wl-1",
  symbol: "BTCUSDT",
  name: "Bitcoin",
  quote: "USDT",
  addedAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

export const makeWatchlistItemLean = (
  overrides: Partial<WatchlistItemLean> = {},
): WatchlistItemLean => ({
  _id: new Types.ObjectId(),
  symbol: "BTCUSDT",
  name: "Bitcoin",
  quote: "USDT",
  addedAt: new Date("2026-01-01T00:00:00.000Z"),
  ...overrides,
});
