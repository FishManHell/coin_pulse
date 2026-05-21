import { HydrationBoundary } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { requireUser } from "@/entities/user/lib/require-user";
import { Sidebar } from "@/widgets/sidebar";
import { dehydrateWatchlist } from "@/entities/watchlist";
import { getWatchlistItems } from "@/entities/watchlist/model/server-queries";

const PrivateLayout = async ({ children }: { children: ReactNode }) => {
  const user = await requireUser();
  const items = await getWatchlistItems(user.id);

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar />
      <main className="md:ml-16 lg:ml-60 flex-1 flex flex-col min-w-0 overflow-y-auto transition-all duration-300">
        <HydrationBoundary state={dehydrateWatchlist(items)}>
          {children}
        </HydrationBoundary>
      </main>
    </div>
  );
};

export default PrivateLayout;
