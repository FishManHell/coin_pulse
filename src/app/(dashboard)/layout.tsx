import { requireUser } from "@/entities/user/lib/require-user";
import { Sidebar } from "@/widgets/sidebar";
import { WatchlistProvider } from "@/shared/ui/watchlist-provider";
import {ReactNode} from "react";

const PrivateLayout = async ({children,}: { children: ReactNode; }) =>  {
  await requireUser();

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <WatchlistProvider />
      <Sidebar />
      <main className="ml-16 lg:ml-60 flex-1 flex flex-col min-w-0 overflow-y-auto transition-all duration-300">
        {children}
      </main>
    </div>
  );
}

export default PrivateLayout;