import mongoose, { Schema } from "mongoose";
import type { Document, Model, Types } from "mongoose"

export interface WatchlistItemDocument extends Document {
  userId: Types.ObjectId;
  symbol: string;
  name: string;
  quote?: string;
  addedAt: Date;
}

const WatchlistItemSchema = new Schema<WatchlistItemDocument>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  quote: { type: String },
  addedAt: { type: Date, default: Date.now },
});

WatchlistItemSchema.index({ userId: 1, symbol: 1 }, { unique: true });

const WatchlistItem: Model<WatchlistItemDocument> =
  mongoose.models.WatchlistItem ??
  mongoose.model<WatchlistItemDocument>("WatchlistItem", WatchlistItemSchema);

export default WatchlistItem;
