"use client";

import { useEffect } from "react";
import { useAppStore } from "@/shared/store";
import type { WatchlistItem } from "@/shared/types";

type Props = { items: WatchlistItem[] };

export const WatchlistInitializer = ({ items }: Readonly<Props>) => {
  const setWatchlist = useAppStore((s) => s.setWatchlist);
  useEffect(() => { setWatchlist(items); }, []);
  return null;
};
