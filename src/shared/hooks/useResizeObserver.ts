"use client";

import { useEffect, type RefObject } from "react";

type ResizeCallback = (entry: ResizeObserverEntry) => void;

export const useResizeObserver = (
  ref: RefObject<Element | null>,
  callback: ResizeCallback,
): void => {
  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) callback(entry);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [ref, callback]);
};
