"use client";

import { useState } from "react";
import { useAppStore } from "@/shared/store";
import { apiFetch } from "@/shared/lib/api-fetch";
import type { WatchlistItem } from "@/entities/watchlist";

export const useAddToWatchlist = () => {
  const [loading, setLoading] = useState(false);
  const setWatchlist = useAppStore((s) => s.setWatchlist);
  const watchlist = useAppStore((s) => s.watchlist);

  const add = async (symbol: string, name: string, quote: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await apiFetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, name, quote }),
      });
      if (!res.ok) return;
      const item: WatchlistItem = await res.json();
      setWatchlist([item, ...watchlist.filter((w) => w.symbol !== symbol)]);
    } finally {
      setLoading(false);
    }
  };

  return { add, loading };
};
