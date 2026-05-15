"use client";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "@/shared/store";
import { createWatchlistItem } from "@/entities/watchlist";

export const useAddToWatchlist = () => {
  const setWatchlist = useAppStore((s) => s.setWatchlist);
  const watchlist = useAppStore((s) => s.watchlist);

  const { mutate, isPending: loading } = useMutation({
    mutationFn: createWatchlistItem,
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
