import { NextResponse } from "next/server";

type CoinGeckoCoin = { symbol: string; name: string };

export async function GET() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1",
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return NextResponse.json({}, { status: 502 });

  const coins: CoinGeckoCoin[] = await res.json();

  const names: Record<string, string> = {};
  for (const { symbol, name } of coins) {
    names[symbol.toUpperCase()] = name;
  }

  return NextResponse.json(names);
}
