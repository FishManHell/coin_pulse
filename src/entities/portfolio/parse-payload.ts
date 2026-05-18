import { parseQuoteFromSymbol } from "@/shared/lib/parse-quote";

export interface ParsedPortfolioPayload {
  symbol: string;
  name: string;
  quote: string;
  quantity: number;
  buyPrice: number;
}

export type ParsePayloadResult =
  | { ok: true; data: ParsedPortfolioPayload }
  | { ok: false; error: string };

export const parsePortfolioPayload = (body: unknown): ParsePayloadResult => {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid payload" };
  }

  const { symbol, name, quantity, buyPrice, quote } = body as Record<string, unknown>;

  if (quote !== undefined && typeof quote !== "string") {
    return { ok: false, error: "Invalid quote" };
  }

  if (typeof symbol !== "string" || !symbol || typeof name !== "string" || !name) {
    return { ok: false, error: "Symbol and name are required" };
  }

  const qty = Number(quantity);
  const price = Number(buyPrice);
  if (!Number.isFinite(qty) || !Number.isFinite(price) || qty <= 0 || price <= 0) {
    return { ok: false, error: "Quantity and price must be positive numbers" };
  }

  const resolvedQuote = quote ?? parseQuoteFromSymbol(symbol);

  return {
    ok: true,
    data: { symbol, name, quote: resolvedQuote, quantity: qty, buyPrice: price },
  };
};
