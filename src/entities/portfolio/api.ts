import { apiFetch } from "@/shared/lib/api-fetch";
import type { PortfolioPosition } from "./types";

export interface CreatePortfolioInput {
  symbol: string;
  name: string;
  quote: string;
  quantity: number;
  buyPrice: number;
}

export const fetchPortfolio = async (): Promise<PortfolioPosition[]> => {
  const res = await apiFetch("/api/portfolio");
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Failed to load portfolio");
  }
  return res.json();
};

export const createPortfolioPosition = async (
  input: CreatePortfolioInput,
): Promise<PortfolioPosition> => {
  const res = await apiFetch("/api/portfolio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? "Failed to add position");
  return body as PortfolioPosition;
};

export const deletePortfolioPosition = async (id: string): Promise<void> => {
  const res = await apiFetch(`/api/portfolio/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Failed to remove position");
  }
};
