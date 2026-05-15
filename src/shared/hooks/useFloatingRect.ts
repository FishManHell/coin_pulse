"use client";

import { useEffect, useState, type RefObject } from "react";

export const useFloatingRect = (
  ref: RefObject<HTMLElement | null>,
  active: boolean
): DOMRect | null => {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!active) return;
    const update = () => {
      if (ref.current) setRect(ref.current.getBoundingClientRect());
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [active, ref]);

  return rect;
};
