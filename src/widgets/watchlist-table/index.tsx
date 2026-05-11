"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "@/shared/store";
import { usePriceStream } from "@/shared/hooks/usePriceStream";
import { ALL_QUOTES, WatchlistQuoteFilter } from "@/features/filter-watchlist-by-quote";
import { EmptyState } from "./EmptyState";
import { TableHeader } from "./TableHeader";
import { WatchlistRow } from "./WatchlistRow";
import { styles } from "./styles";
import type { WatchlistItem } from "@/entities/watchlist";

type WatchlistTableProps = Readonly<{
  initialItems: WatchlistItem[];
}>;

export const WatchlistTable = ({ initialItems }: WatchlistTableProps) => {
  const setWatchlist = useAppStore((s) => s.setWatchlist);
  const watchlist = useAppStore((s) => s.watchlist);
  const [filter, setFilter] = useState<string>(ALL_QUOTES);

  const symbols = useMemo(() => watchlist.map((w) => w.symbol), [watchlist]);
  usePriceStream(symbols);

  useEffect(() => {
    setWatchlist(initialItems);
  }, []);

  const quotes = useMemo(
    () => [...new Set(watchlist.map((w) => w.quote))].sort(),
    [watchlist],
  );

  const visible = filter === ALL_QUOTES
    ? watchlist
    : watchlist.filter((w) => w.quote === filter);

  return (
    <div className={styles.wrap}>
      {quotes.length > 1 && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted uppercase tracking-wider">Quote</span>
          <WatchlistQuoteFilter value={filter} onChange={setFilter} quotes={quotes} />
        </div>
      )}

      {watchlist.length === 0 ? <EmptyState /> : (
        <div className={styles.table}>
          <div className={styles.tableScroll}>
            <div className={styles.tableInner}>
              <TableHeader />
              {visible.map((item) => <WatchlistRow key={item.symbol} item={item} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
