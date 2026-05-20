import { apiFetch } from "@/shared/lib/api-fetch";
import type { WatchlistItem } from "./types";

export interface CreateWatchlistInput {
  symbol: string;
  name: string;
  quote: string;
}

export const fetchWatchlist = async (): Promise<WatchlistItem[]> => {
  const res = await apiFetch("/api/watchlist");
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Failed to load watchlist");
  }
  return res.json();
};

export const createWatchlistItem = async (
  input: CreateWatchlistInput,
): Promise<WatchlistItem> => {
  const res = await apiFetch("/api/watchlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? "Failed to add to watchlist");
  return body as WatchlistItem;
};

export const deleteWatchlistItem = async (symbol: string): Promise<void> => {
  const res = await apiFetch(`/api/watchlist/${symbol}`, { method: "DELETE" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Failed to remove from watchlist");
  }
};
