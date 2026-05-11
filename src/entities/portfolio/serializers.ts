import { parseQuoteFromSymbol } from "@/shared/lib/parse-quote";
import type { PortfolioPosition, PortfolioPositionLean } from "./types";

export const toPortfolioDTO = (doc: PortfolioPositionLean): PortfolioPosition => ({
  id: doc._id.toString(),
  symbol: doc.symbol,
  name: doc.name,
  quote: doc.quote ?? parseQuoteFromSymbol(doc.symbol),
  quantity: doc.quantity,
  buyPrice: doc.buyPrice,
  createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
});
