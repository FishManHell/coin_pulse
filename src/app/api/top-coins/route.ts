import { NextResponse } from "next/server";
import { fetchTopSymbols } from "@/shared/api/binance";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const quote = searchParams.get("quote") ?? "USDT";
  const limit = Number(searchParams.get("limit") ?? "6");
  const symbols = await fetchTopSymbols(limit, quote);
  return NextResponse.json(symbols);
}
