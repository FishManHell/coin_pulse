"use client";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "@/shared/store";
import { apiFetch } from "@/shared/lib/api-fetch";
import type { WatchlistItem } from "@/entities/watchlist";

interface AddInput {
  symbol: string;
  name: string;
  quote: string;
}

export const useAddToWatchlist = () => {
  const setWatchlist = useAppStore((s) => s.setWatchlist);
  const watchlist = useAppStore((s) => s.watchlist);

  const { mutate, isPending: loading } = useMutation({
    mutationFn: async (input: AddInput): Promise<WatchlistItem> => {
      const res = await apiFetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to add to watchlist");
      }
      return res.json();
    },
    onSuccess: (item, input) => {
      setWatchlist([item, ...watchlist.filter((w) => w.symbol !== input.symbol)]);
      toast.success(`${input.name} added to watchlist`);
    },
    onError: (err) => {
      toast.error("Couldn't add to watchlist", { description: err.message });
    },
  });

  const add = (symbol: string, name: string, quote: string) => {
    if (loading) return;
    mutate({ symbol, name, quote });
  };

  return { add, loading };
};
