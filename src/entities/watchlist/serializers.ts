import { parseQuoteFromSymbol } from "@/shared/lib/parse-quote";
import type { WatchlistItem, WatchlistItemLean } from "./types";

export const toWatchlistDTO = (doc: WatchlistItemLean): WatchlistItem => ({
  id: doc._id.toString(),
  symbol: doc.symbol,
  name: doc.name,
  quote: doc.quote ?? parseQuoteFromSymbol(doc.symbol),
  addedAt: doc.addedAt instanceof Date ? doc.addedAt.toISOString() : doc.addedAt,
});
