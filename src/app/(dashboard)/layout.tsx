import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/lib/auth-config";
import connectDB from "@/shared/lib/db";
import WatchlistItem from "../../../models/WatchlistItem";
import { Sidebar } from "@/widgets/sidebar";
import { WatchlistInitializer } from "@/shared/ui/watchlist-initializer";
import type { WatchlistItem as WatchlistItemType } from "@/shared/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  await connectDB();
  const rawItems = await WatchlistItem.find({
    userId: (session.user as { id: string }).id,
  })
    .sort({ addedAt: -1 })
    .lean();

  const watchlist: WatchlistItemType[] = rawItems.map((item) => ({
    id: item._id.toString(),
    symbol: item.symbol,
    name: item.name,
    addedAt: item.addedAt.toISOString(),
  }));

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <WatchlistInitializer items={watchlist} />
      <Sidebar />
      <main className="ml-16 lg:ml-60 flex-1 flex flex-col min-w-0 overflow-y-auto transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
