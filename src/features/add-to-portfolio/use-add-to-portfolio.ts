"use client";

import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  createPortfolioPosition,
  portfolioKeys,
  type CreatePortfolioInput,
  type PortfolioPosition,
} from "@/entities/portfolio";
import { useApiErrorTranslator } from "@/shared/lib/use-api-error-translator";

export const useAddToPortfolio = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("toasts.portfolio");
  const translateError = useApiErrorTranslator();

  const mutation = useMutation({
    mutationFn: createPortfolioPosition,
    onSuccess: (position, input) => {
      queryClient.setQueryData<PortfolioPosition[]>(
        portfolioKeys.list(),
        (prev) => [position, ...(prev ?? [])],
      );
      toast.success(t("added", { name: input.name }));
    },
    onError: (err) => {
      toast.error(t("addFailed"), { description: translateError(err.message) });
    },
  });

  const add = async (input: CreatePortfolioInput): Promise<boolean> => {
    try {
      await mutation.mutateAsync(input);
      return true;
    } catch {
      return false;
    }
  };

  return { add, loading: mutation.isPending };
};
