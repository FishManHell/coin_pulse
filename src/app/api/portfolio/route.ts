import { NextResponse } from "next/server";
import { requireApiUser } from "@/entities/user/lib/require-api-user";
import connectDB from "@/shared/lib/db";
import { parseQuoteFromSymbol } from "@/shared/lib/parse-quote";
import { tradingPairs } from "@/shared/api/binance";
import PortfolioPosition from "@/entities/portfolio/model/portfolio-position";
import { toPortfolioDTO } from "@/entities/portfolio";
import { apiError, ERRORS } from "@/shared/lib/api-response";
import { requireString } from "@/shared/lib/validate";

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  await connectDB();
  const items = await PortfolioPosition.find({ userId: auth.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(items.map(toPortfolioDTO));
}

export async function POST(req: Request) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  try {
    const { symbol, name, quantity, buyPrice, quote } = await req.json();

    const typeError = requireString(quote, "quote");
    if (typeError) return typeError;

    if (typeof symbol !== "string" || !symbol || typeof name !== "string" || !name) {
      return apiError("Symbol and name are required", 400);
    }

    const qty = Number(quantity);
    const price = Number(buyPrice);
    if (!Number.isFinite(qty) || !Number.isFinite(price) || qty <= 0 || price <= 0) {
      return apiError("Quantity and price must be positive numbers", 400);
    }

    const resolvedQuote = quote ?? parseQuoteFromSymbol(symbol);

    if (tradingPairs.get(symbol) !== resolvedQuote) {
      return apiError("Pair is not tradeable on Binance", 400);
    }

    await connectDB();
    const position = await PortfolioPosition.create({
      userId: auth.user.id,
      symbol,
      name,
      quote: resolvedQuote,
      quantity: qty,
      buyPrice: price,
    });

    return NextResponse.json(toPortfolioDTO(position.toObject()), { status: 201 });
  } catch (err) {
    console.error("portfolio POST error:", err);
    return ERRORS.serverError();
  }
}
