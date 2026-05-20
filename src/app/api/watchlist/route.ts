import { NextResponse } from "next/server";
import { requireApiUser } from "@/entities/user/lib/require-api-user";
import connectDB from "@/shared/lib/db";
import { parseQuoteFromSymbol } from "@/shared/lib/parse-quote";
import WatchlistItem from "@/entities/watchlist/model/watchlist-item";
import { toWatchlistDTO } from "@/entities/watchlist";
import { getWatchlistItems } from "@/entities/watchlist/model/server-queries";
import { apiError } from "@/shared/lib/api-response";

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  return NextResponse.json(await getWatchlistItems(auth.user.id));
}

export async function POST(req: Request) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  const { symbol, name, quote } = await req.json();
  if (!symbol || !name) return apiError("watchlist.symbolAndNameRequired", 400);

  const resolvedQuote = quote ?? parseQuoteFromSymbol(symbol);

  await connectDB();

  const item = await WatchlistItem.findOneAndUpdate(
    { userId: auth.user.id, symbol },
    { userId: auth.user.id, symbol, name, quote: resolvedQuote, addedAt: new Date() },
    { upsert: true, new: true }
  ).lean();

  return NextResponse.json(toWatchlistDTO(item!), { status: 201 });
}
