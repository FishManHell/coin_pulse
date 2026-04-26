"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/shared/store";
import { useAddToPortfolio } from "./use-add-to-portfolio";

type Fields = {
  symbol: string;
  quantity: string;
  buyPrice: string;
};

const initialFields: Fields = { symbol: "", quantity: "", buyPrice: "" };

export const usePositionForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const tradeablePairs = useAppStore((s) => s.tradeablePairs);
  const { add, loading, error } = useAddToPortfolio();
  const [fields, setFields] = useState<Fields>(initialFields);

  // Auto-pick first pair as default when list is ready
  useEffect(() => {
    if (!fields.symbol && tradeablePairs.length > 0) {
      setFields((f) => ({ ...f, symbol: tradeablePairs[0].symbol }));
    }
  }, [tradeablePairs, fields.symbol]);

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const coin = tradeablePairs.find((c) => c.symbol === fields.symbol);
    if (!coin) return;
    const ok = await add({
      symbol: coin.symbol,
      name: coin.name,
      quantity: Number(fields.quantity),
      buyPrice: Number(fields.buyPrice),
    });
    if (ok) {
      setFields(initialFields);
      onSuccess();
    }
  };

  return {
    fields,
    set,
    submit,
    loading,
    error,
    noPairs: tradeablePairs.length === 0,
  };
};
