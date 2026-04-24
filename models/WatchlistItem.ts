import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export type WatchlistItemDocument = Document & {
  userId: Types.ObjectId;
  symbol: string;
  name: string;
  addedAt: Date;
};

const WatchlistItemSchema = new Schema<WatchlistItemDocument>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
});

WatchlistItemSchema.index({ userId: 1, symbol: 1 }, { unique: true });

const WatchlistItem: Model<WatchlistItemDocument> =
  mongoose.models.WatchlistItem ??
  mongoose.model<WatchlistItemDocument>("WatchlistItem", WatchlistItemSchema);

export default WatchlistItem;
