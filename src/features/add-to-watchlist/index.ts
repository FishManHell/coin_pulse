"use client";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { createWatchlistItem, useWatchlistStore } from "@/entities/watchlist";

export const useAddToWatchlist = () => {
  const setItems = useWatchlistStore((s) => s.setItems);

  const { mutate, isPending: loading } = useMutation({
    mutationFn: createWatchlistItem,
    onSuccess: (item, input) => {
      const current = useWatchlistStore.getState().items;
      setItems([item, ...current.filter((w) => w.symbol !== input.symbol)]);
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
