"use client";

import { useTranslations } from "next-intl";
import { useSelectionStore } from "@/shared/store";
import { useWatchlist } from "@/entities/watchlist";
import { useCoinMeta } from "@/shared/hooks/useCoinMeta";
import { useAddToWatchlist } from "@/features/add-to-watchlist";
import { useRemoveFromWatchlist } from "@/features/remove-from-watchlist";
import { CoinHeader } from "./CoinHeader";
import { LivePriceBlock } from "./LivePriceBlock";
import { LiveStats } from "./LiveStats";
import { styles } from "./styles";

export const CoinDetailsPanel = () => {
  const selectedSymbol = useSelectionStore((s) => s.selectedSymbol);
  const selectedQuote  = useSelectionStore((s) => s.selectedQuote);
  const { data: isWatched = false } = useWatchlist((items) =>
    items.some((w) => w.symbol === selectedSymbol),
  );
  const { add,    loading: adding }   = useAddToWatchlist();
  const { remove, loading: removing } = useRemoveFromWatchlist();
  const t = useTranslations("dashboard.coinDetails");

  const { names }   = useCoinMeta(selectedQuote);
  const base        = selectedSymbol.slice(0, -selectedQuote.length);
  const displayName = names[base];

  const onToggleWatch = () => {
      return isWatched ? remove(selectedSymbol) : add(selectedSymbol, displayName ?? base, selectedQuote);
  }

  return (
    <aside className={styles.aside}>
      <div className={styles.headerSection}>
        <CoinHeader
          base={base}
          quote={selectedQuote}
          displayName={displayName}
          isWatched={isWatched}
          onToggleWatch={onToggleWatch}
          toggling={adding || removing}
        />
        <LivePriceBlock symbol={selectedSymbol} />
      </div>

      <div className={styles.statsSection}>
        <p className={styles.statsTitle}>{t("marketStats")}</p>
        <LiveStats symbol={selectedSymbol} />
      </div>

      <div className={styles.liveFooter}>
        <div className={styles.liveRow}>
          <span className={styles.liveDot} />
          {t("liveData")}
        </div>
      </div>
    </aside>
  );
};
