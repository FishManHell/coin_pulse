"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useWatchlist } from "@/entities/watchlist";
import { usePriceStream } from "@/entities/coin";
import { ALL_QUOTES, WatchlistQuoteFilter } from "@/features/filter-watchlist-by-quote";
import { EmptyState } from "./EmptyState";
import { TableHeader } from "./TableHeader";
import { WatchlistRow } from "./WatchlistRow";
import { styles } from "./styles";

export const WatchlistTable = () => {
  const { data: watchlist = [] } = useWatchlist();
  const [filter, setFilter] = useState<string>(ALL_QUOTES);
  const t = useTranslations("watchlist.filter");

  const symbols = useMemo(() => watchlist.map((w) => w.symbol), [watchlist]);
  usePriceStream(symbols);

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
          <span className="text-xs text-text-muted uppercase tracking-wider">{t("label")}</span>
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
