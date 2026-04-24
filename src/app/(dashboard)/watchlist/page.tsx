import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/entities/user/lib/auth-config";
import connectDB from "@/shared/lib/db";
import WatchlistItem from "../../../../models/WatchlistItem";
import { Header } from "@/widgets/header";
import { WatchlistTable } from "@/widgets/watchlist-table";
import type { WatchlistItem as WatchlistItemType } from "@/shared/types";

export default async function WatchlistPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

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

  return (
    <>
      <Header title="Watchlist" />
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
