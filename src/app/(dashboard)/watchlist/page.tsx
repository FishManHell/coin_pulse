import { requireUser } from "@/entities/user/lib/require-user";
import connectDB from "@/shared/lib/db";
import WatchlistItem from "@/entities/watchlist/model/watchlist-item";
import { toWatchlistDTO } from "@/entities/watchlist";
import { Header } from "@/widgets/header";
import { WatchlistTable } from "@/widgets/watchlist-table";

const WatchlistPage = async () =>  {
  const user = await requireUser();

  await connectDB();
  const rawItems = await WatchlistItem.find({ userId: user.id })
    .sort({ addedAt: -1 })
    .lean();

  const items = rawItems.map(toWatchlistDTO);

  return (
    <>
      <Header title="Watchlist" showSearch={false}/>
      <div className="flex-1 p-6 flex flex-col min-h-0">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-text-primary">
            Your watchlist
          </h2>
          <p className="text-text-muted text-sm mt-1">
            {items.length} {items.length === 1 ? "asset" : "assets"} tracked
          </p>
        </div>
        <WatchlistTable initialItems={items} />
      </div>
    </>
  );
}

export default WatchlistPage;