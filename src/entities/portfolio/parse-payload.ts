import { parseQuoteFromSymbol } from "@/shared/lib/parse-quote";

export interface ParsedPortfolioPayload {
  symbol: string;
  name: string;
  quote: string;
  quantity: number;
  buyPrice: number;
}

// `error` is a dot-path under `errors.*` in messages files (see api-response.ts).
export type ParsePayloadResult =
  | { ok: true; data: ParsedPortfolioPayload }
  | { ok: false; error: string };

export const parsePortfolioPayload = (body: unknown): ParsePayloadResult => {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "portfolio.invalidPayload" };
  }

  const { symbol, name, quantity, buyPrice, quote } = body as Record<string, unknown>;

  if (quote !== undefined && typeof quote !== "string") {
    return { ok: false, error: "portfolio.invalidQuote" };
  }

  if (typeof symbol !== "string" || !symbol || typeof name !== "string" || !name) {
    return { ok: false, error: "portfolio.symbolAndNameRequired" };
  }

  const qty = Number(quantity);
  const price = Number(buyPrice);
  if (!Number.isFinite(qty) || !Number.isFinite(price) || qty <= 0 || price <= 0) {
    return { ok: false, error: "portfolio.positiveNumbersRequired" };
  }

  const resolvedQuote = quote ?? parseQuoteFromSymbol(symbol);

  return {
    ok: true,
    data: { symbol, name, quote: resolvedQuote, quantity: qty, buyPrice: price },
  };
};
