"use client";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { createWatchlistItem, useWatchlistStore } from "@/entities/watchlist";
import { useApiErrorTranslator } from "@/shared/lib/use-api-error-translator";

export const useAddToWatchlist = () => {
  const setItems = useWatchlistStore((s) => s.setItems);
  const t = useTranslations("toasts.watchlist");
  const translateError = useApiErrorTranslator();

  const { mutate, isPending: loading } = useMutation({
    mutationFn: createWatchlistItem,
    onSuccess: (item, input) => {
      const current = useWatchlistStore.getState().items;
      setItems([item, ...current.filter((w) => w.symbol !== input.symbol)]);
      toast.success(t("added", { name: input.name }));
    },
    onError: (err) => {
      toast.error(t("addFailed"), { description: translateError(err.message) });
    },
  });

  const add = (symbol: string, name: string, quote: string) => {
    if (loading) return;
    mutate({ symbol, name, quote });
  };

  return { add, loading };
};
