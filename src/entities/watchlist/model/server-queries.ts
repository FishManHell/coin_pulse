import { cache } from "react";
import connectDB from "@/shared/lib/db";
import WatchlistModel from "./watchlist-item";
import { toWatchlistDTO } from "../serializers";
import type { WatchlistItem } from "../types";

export const getWatchlistItems = cache(
  async (userId: string): Promise<WatchlistItem[]> => {
    await connectDB();
    const raw = await WatchlistModel.find({ userId }).sort({ addedAt: -1 }).lean();
    return raw.map(toWatchlistDTO);
  },
);
