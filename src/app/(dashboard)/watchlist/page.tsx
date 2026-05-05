import { requireUser } from "@/entities/user/lib/require-user";
import connectDB from "@/shared/lib/db";
import { parseQuoteFromSymbol } from "@/shared/lib/parse-quote";
import WatchlistItem from "../../../../models/WatchlistItem";
import { Header } from "@/widgets/header";
import { WatchlistTable } from "@/widgets/watchlist-table";
import type { WatchlistItem as WatchlistItemType } from "@/shared/types";

const WatchlistPage = async () =>  {
  const user = await requireUser();

  await connectDB();
  const rawItems = await WatchlistItem.find({ userId: user.id })
    .sort({ addedAt: -1 })
    .lean();

  const items: WatchlistItemType[] = rawItems.map((item) => ({
    id: item._id.toString(),
    symbol: item.symbol,
    name: item.name,
    quote: item.quote ?? parseQuoteFromSymbol(item.symbol),
    addedAt: item.addedAt.toISOString(),
  }));

  return (
    <>
      <Header title="Watchlist" showSearch={false}/>
      <div className="flex-1 p-6">
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