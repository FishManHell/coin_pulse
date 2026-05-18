"use client";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  createPortfolioPosition,
  usePortfolioStore,
  type CreatePortfolioInput,
} from "@/entities/portfolio";

export const useAddToPortfolio = () => {
  const setPositions = usePortfolioStore((s) => s.setPositions);

  const mutation = useMutation({
    mutationFn: createPortfolioPosition,
    onSuccess: (position, input) => {
      const current = usePortfolioStore.getState().positions;
      setPositions([position, ...current]);
      toast.success(`${input.name} added to portfolio`);
    },
    onError: (err) => {
      toast.error("Couldn't add position", { description: err.message });
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
