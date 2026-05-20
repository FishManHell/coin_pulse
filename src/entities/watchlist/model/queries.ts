import {
  QueryClient,
  dehydrate,
  queryOptions,
  useQuery,
  type DehydratedState,
} from "@tanstack/react-query";
import { fetchWatchlist } from "../api";
import type { WatchlistItem } from "../types";

export const watchlistKeys = {
  all: ["watchlist"] as const,
  list: () => [...watchlistKeys.all, "list"] as const,
};

export const watchlistListOptions = () =>
  queryOptions({
    queryKey: watchlistKeys.list(),
    queryFn: fetchWatchlist,
    staleTime: Infinity,
  });

export const useWatchlist = <T = WatchlistItem[]>(
  select?: (data: WatchlistItem[]) => T,
) => useQuery({ ...watchlistListOptions(), select });

export const dehydrateWatchlist = (
  initialData: WatchlistItem[],
): DehydratedState => {
  const qc = new QueryClient();
  qc.setQueryData(watchlistKeys.list(), initialData);
  return dehydrate(qc);
};
