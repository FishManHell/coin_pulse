"use client";

import { useState, type KeyboardEvent } from "react";

interface Args<T> {
  open: boolean;
  setOpen: (open: boolean) => void;
  results: readonly T[];
  onSelect: (item: T) => void;
}

interface Return {
  activeIndex: number;
  onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
  onHoverItem: (index: number) => void;
}

export const useComboboxKeyboard = <T,>({ open, setOpen, results, onSelect }: Args<T>): Return => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevResults, setPrevResults] = useState(results);

  if (prevResults !== results) {
    setPrevResults(results);
    setActiveIndex(0);
  }

  const clamped = results.length === 0 ? -1 : Math.min(activeIndex, results.length - 1);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) setOpen(true);
        if (results.length) setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        return;
      case "ArrowUp":
        e.preventDefault();
        if (results.length) setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      case "Enter":
        if (open && clamped >= 0) {
          e.preventDefault();
          onSelect(results[clamped]);
        }
        return;
      case "Home":
        if (open && results.length) {
          e.preventDefault();
          setActiveIndex(0);
        }
        return;
      case "End":
        if (open && results.length) {
          e.preventDefault();
          setActiveIndex(results.length - 1);
        }
    }
  };

  return { activeIndex: clamped, onKeyDown, onHoverItem: setActiveIndex };
};
