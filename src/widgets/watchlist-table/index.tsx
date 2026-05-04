"use client";

import { useEffect } from "react";
import { useAppStore } from "@/shared/store";
import { usePriceStream } from "@/shared/hooks/usePriceStream";
import { EmptyState } from "./EmptyState";
import { TableHeader } from "./TableHeader";
import { WatchlistRow } from "./WatchlistRow";
import { styles } from "./styles";
import type { WatchlistItem } from "@/shared/types";

type WatchlistTableProps = Readonly<{
  initialItems: WatchlistItem[];
}>;

export const WatchlistTable = ({ initialItems }: WatchlistTableProps) => {
  const setWatchlist = useAppStore((s) => s.setWatchlist);
  const watchlist = useAppStore((s) => s.watchlist);
  const symbols = watchlist.map((w) => w.symbol);
  usePriceStream(symbols);

  useEffect(() => {
    setWatchlist(initialItems);
  }, []);

  if (watchlist.length === 0) return <EmptyState />;

  return (
    <div className={styles.table}>
      <TableHeader />
      {watchlist.map((item) => <WatchlistRow key={item.symbol} item={item} />)}
    </div>
  );
};
