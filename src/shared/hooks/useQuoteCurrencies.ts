"use client";

import { useQuery } from "@tanstack/react-query";

const FALLBACK_QUOTES = ["USDT"];

export const useQuoteCurrencies = (): string[] => {
  const { data } = useQuery({
    queryKey: ["quote-currencies"],
    queryFn: async (): Promise<string[]> => {
      const res = await fetch("/api/quote-currencies");
      if (!res.ok) return FALLBACK_QUOTES;
      const data = await res.json();
      return Array.isArray(data) && data.length ? data : FALLBACK_QUOTES;
    },
  });
  return data ?? FALLBACK_QUOTES;
};
