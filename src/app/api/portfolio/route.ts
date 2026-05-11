import { NextResponse } from "next/server";
import { requireApiUser } from "@/entities/user/lib/require-api-user";
import connectDB from "@/shared/lib/db";
import { parseQuoteFromSymbol } from "@/shared/lib/parse-quote";
import { tradingPairs } from "@/shared/api/binance";
import PortfolioPosition from "@/models/PortfolioPosition";

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  await connectDB();
  const items = await PortfolioPosition.find({ userId: auth.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const hydrated = items.map((p) => ({
    ...p,
    quote: p.quote ?? parseQuoteFromSymbol(p.symbol),
  }));

  return NextResponse.json(hydrated);
}

export async function POST(req: Request) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  const { symbol, name, quantity, buyPrice, quote } = await req.json();
  if (!symbol || !name || !quantity || !buyPrice) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }
  if (quantity <= 0 || buyPrice <= 0) {
    return NextResponse.json({ error: "Quantity and price must be positive" }, { status: 400 });
  }

  const resolvedQuote = quote ?? parseQuoteFromSymbol(symbol);

  if (tradingPairs.get(symbol) !== resolvedQuote) {
    return NextResponse.json({ error: "Pair is not tradeable on Binance" }, { status: 400 });
  }

  await connectDB();
  const position = await PortfolioPosition.create({
    userId: auth.user.id,
    symbol,
    name,
    quote: resolvedQuote,
    quantity: Number(quantity),
    buyPrice: Number(buyPrice),
  });

  return NextResponse.json(position, { status: 201 });
}
