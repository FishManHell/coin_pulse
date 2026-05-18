"use client";

import { useEffect } from "react";
import type { WatchlistItem } from "../types";
import { useWatchlistStore } from "../model/store";

type Props = { items: WatchlistItem[] };

export const WatchlistInitializer = ({ items }: Readonly<Props>) => {
  const setItems = useWatchlistStore((s) => s.setItems);
  // One-time hydration from server props. Including deps would re-fire on
  // every prop update and overwrite later store changes from user actions.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setItems(items); }, []);
  return null;
};
