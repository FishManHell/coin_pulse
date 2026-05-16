import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface PortfolioPositionDocument extends Document {
  userId: Types.ObjectId;
  symbol: string;
  name: string;
  quote?: string;
  quantity: number;
  buyPrice: number;
  createdAt: Date;
}

const PortfolioPositionSchema = new Schema<PortfolioPositionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    quote: { type: String },
    quantity: { type: Number, required: true, min: 0 },
    buyPrice: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const PortfolioPosition: Model<PortfolioPositionDocument> =
  mongoose.models.PortfolioPosition ??
  mongoose.model<PortfolioPositionDocument>(
    "PortfolioPosition",
    PortfolioPositionSchema
  );

export default PortfolioPosition;
