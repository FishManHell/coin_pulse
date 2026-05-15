"use client";

import { useEffect, useState } from "react";

export const useStaleAfter = <T>(value: T, ms: number): boolean => {
  const [stale, setStale] = useState(false);
  const [prevValue, setPrevValue] = useState(value);

  if (prevValue !== value) {
    setPrevValue(value);
    setStale(false);
  }

  useEffect(() => {
    const t = setTimeout(() => setStale(true), ms);
    return () => clearTimeout(t);
  }, [value, ms]);

  return stale;
};
