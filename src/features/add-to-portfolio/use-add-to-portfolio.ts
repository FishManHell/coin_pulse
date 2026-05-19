"use client";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  createPortfolioPosition,
  usePortfolioStore,
  type CreatePortfolioInput,
} from "@/entities/portfolio";
import { useApiErrorTranslator } from "@/shared/lib/use-api-error-translator";

export const useAddToPortfolio = () => {
  const setPositions = usePortfolioStore((s) => s.setPositions);
  const t = useTranslations("toasts.portfolio");
  const translateError = useApiErrorTranslator();

  const mutation = useMutation({
    mutationFn: createPortfolioPosition,
    onSuccess: (position, input) => {
      const current = usePortfolioStore.getState().positions;
      setPositions([position, ...current]);
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
