import { HydrationBoundary } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { requireUser } from "@/entities/user/lib/require-user";
import { Sidebar } from "@/widgets/sidebar";
import connectDB from "@/shared/lib/db";
import WatchlistItem from "@/entities/watchlist/model/watchlist-item";
import { dehydrateWatchlist, toWatchlistDTO } from "@/entities/watchlist";

const PrivateLayout = async ({ children }: { children: ReactNode }) => {
  const user = await requireUser();

  await connectDB();
  const rawItems = await WatchlistItem.find({ userId: user.id })
    .sort({ addedAt: -1 })
    .lean();
  const items = rawItems.map(toWatchlistDTO);

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar />
      <main className="ml-16 lg:ml-60 flex-1 flex flex-col min-w-0 overflow-y-auto transition-all duration-300">
        <HydrationBoundary state={dehydrateWatchlist(items)}>
          {children}
        </HydrationBoundary>
      </main>
    </div>
  );
};

export default PrivateLayout;
