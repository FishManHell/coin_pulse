"use client";

import { useTranslations } from "next-intl";
import { useWatchlist } from "@/entities/watchlist";

export const WatchlistCount = () => {
  const { data: count = 0 } = useWatchlist((items) => items.length);
  const t = useTranslations();
  return (
    <p className="text-text-muted text-sm mt-1">
      {t("sections.assetsTracked", { count })}
    </p>
  );
};
