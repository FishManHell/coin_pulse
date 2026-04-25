import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/lib/auth-config";
import { Sidebar } from "@/widgets/sidebar";
import { WatchlistProvider } from "@/shared/ui/watchlist-provider";
import { CoinNamesInitializer } from "@/shared/ui/coin-names-initializer";
import {ReactNode} from "react";

const PrivateLayout = async ({children,}: { children: ReactNode; }) =>  {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <WatchlistProvider />
      <CoinNamesInitializer />
      <Sidebar />
      <main className="ml-16 lg:ml-60 flex-1 flex flex-col min-w-0 overflow-y-auto transition-all duration-300">
        {children}
      </main>
    </div>
  );
}

export default PrivateLayout;