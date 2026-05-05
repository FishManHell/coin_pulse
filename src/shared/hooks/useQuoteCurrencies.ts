"use client";

import { useEffect, useState } from "react";

export const useQuoteCurrencies = () => {
  const [quotes, setQuotes] = useState<string[]>(["USDT"]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/quote-currencies")
      .then((r) => r.json())
      .then((data: string[]) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length) setQuotes(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return quotes;
};
