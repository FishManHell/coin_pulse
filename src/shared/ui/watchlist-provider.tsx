import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/lib/auth-config";
import connectDB from "@/shared/lib/db";
import WatchlistItem from "../../../models/WatchlistItem";
import { WatchlistInitializer } from "./watchlist-initializer";
import type { WatchlistItem as WatchlistItemType } from "@/shared/types";

export const WatchlistProvider = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  await connectDB();
  const rawItems = await WatchlistItem.find({
    userId: (session.user as { id: string }).id,
  })
    .sort({ addedAt: -1 })
    .lean();

  const items: WatchlistItemType[] = rawItems.map((item) => ({
    id: item._id.toString(),
    symbol: item.symbol,
    name: item.name,
    addedAt: item.addedAt.toISOString(),
  }));

  return <WatchlistInitializer items={items} />;
};
