"use client";

import { useEffect } from "react";
import { useAppStore } from "@/shared/store";
import type { WatchlistItem } from "@/entities/watchlist";

type Props = { items: WatchlistItem[] };

export const WatchlistInitializer = ({ items }: Readonly<Props>) => {
  const setWatchlist = useAppStore((s) => s.setWatchlist);
  // One-time hydration from server props. Including deps would re-fire on
  // every prop update and overwrite later store changes from user actions.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setWatchlist(items); }, []);
  return null;
};
