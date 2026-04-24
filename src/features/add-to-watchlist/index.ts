"use client";

import { useState } from "react";
import { useAppStore } from "@/shared/store";
import type { WatchlistItem } from "@/shared/types";

export const useAddToWatchlist = () => {
  const [loading, setLoading] = useState(false);
  const setWatchlist = useAppStore((s) => s.setWatchlist);
  const watchlist = useAppStore((s) => s.watchlist);

  const add = async (symbol: string, name: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, name }),
      });
      if (!res.ok) return;
      const item: WatchlistItem & { _id: string } = await res.json();
      const newItem: WatchlistItem = {
        id: item._id,
        symbol: item.symbol,
        name: item.name,
        addedAt: item.addedAt,
      };
      setWatchlist([newItem, ...watchlist.filter((w) => w.symbol !== symbol)]);
    } finally {
      setLoading(false);
    }
  };

  return { add, loading };
};
