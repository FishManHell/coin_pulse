import { NextResponse } from "next/server";
import { requireApiUser } from "@/entities/user/lib/require-api-user";
import connectDB from "@/shared/lib/db";
import { tradingPairs } from "@/shared/api/binance";
import PortfolioPosition from "@/entities/portfolio/model/portfolio-position";
import { toPortfolioDTO, parsePortfolioPayload } from "@/entities/portfolio";
import { apiError, ERRORS } from "@/shared/lib/api-response";

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
    const parsed = parsePortfolioPayload(await req.json());
    if (!parsed.ok) return apiError(parsed.error, 400);

    const { symbol, name, quote, quantity, buyPrice } = parsed.data;
    if (tradingPairs.get(symbol) !== quote) {
      return apiError("portfolio.pairNotTradeable", 400);
    }

    await connectDB();
    const position = await PortfolioPosition.create({
      userId: auth.user.id,
      symbol,
      name,
      quote,
      quantity,
      buyPrice,
    });

    return NextResponse.json(toPortfolioDTO(position.toObject()), { status: 201 });
  } catch (err) {
    console.error("portfolio POST error:", err);
    return ERRORS.serverError();
  }
}
