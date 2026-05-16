import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/lib/auth-config";
import connectDB from "@/shared/lib/db";
import WatchlistItem from "@/entities/watchlist/model/watchlist-item";
import { toWatchlistDTO } from "@/entities/watchlist";
import { WatchlistInitializer } from "./watchlist-initializer";

export const WatchlistProvider = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  await connectDB();
  const rawItems = await WatchlistItem.find({
    userId: (session.user as { id: string }).id,
  })
    .sort({ addedAt: -1 })
    .lean();

  const items = rawItems.map(toWatchlistDTO);

  return <WatchlistInitializer items={items} />;
};
