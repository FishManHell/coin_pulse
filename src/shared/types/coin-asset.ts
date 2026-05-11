import type { Types } from "mongoose";

// Shared base for any "coin asset" entity (watchlist, portfolio, future trades).
// DTO form — fully serialized, quote always resolved by the serializer.
export interface CoinAssetDTO {
  id: string;
  symbol: string;
  name: string;
  quote: string;
}

// Lean form — raw mongo document fields, quote may be absent on legacy rows.
export interface CoinAssetLean {
  _id: Types.ObjectId | string;
  symbol: string;
  name: string;
  quote?: string;
}
