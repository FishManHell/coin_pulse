import { NextResponse } from "next/server";
import { fetchQuoteCurrencies } from "@/shared/api/binance";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? "2");
  const quotes = await fetchQuoteCurrencies(limit);
  return NextResponse.json(quotes);
}
