"use client";

import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  createWatchlistItem,
  watchlistKeys,
  type WatchlistItem,
} from "@/entities/watchlist";
import { useApiErrorTranslator } from "@/shared/lib/use-api-error-translator";

export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("toasts.watchlist");
  const translateError = useApiErrorTranslator();

  const { mutate, isPending: loading } = useMutation({
    mutationFn: createWatchlistItem,
    onSuccess: (item, input) => {
      queryClient.setQueryData<WatchlistItem[]>(watchlistKeys.list(), (prev) => [
        item,
        ...(prev ?? []).filter((w) => w.symbol !== input.symbol),
      ]);
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
