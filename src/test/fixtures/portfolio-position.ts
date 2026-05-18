import { Types } from "mongoose";
import type { PortfolioPosition, PortfolioPositionLean } from "@/entities/portfolio";

export const makePortfolioPosition = (
  overrides: Partial<PortfolioPosition> = {},
): PortfolioPosition => ({
  id: "pos-1",
  symbol: "BTCUSDT",
  name: "Bitcoin",
  quote: "USDT",
  quantity: 1,
  buyPrice: 100,
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

export const makePortfolioPositionLean = (
  overrides: Partial<PortfolioPositionLean> = {},
): PortfolioPositionLean => ({
  _id: new Types.ObjectId(),
  symbol: "BTCUSDT",
  name: "Bitcoin",
  quote: "USDT",
  quantity: 1,
  buyPrice: 100,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  ...overrides,
});
