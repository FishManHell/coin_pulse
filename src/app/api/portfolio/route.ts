import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/lib/auth-config";
import connectDB from "@/shared/lib/db";
import PortfolioPosition from "../../../../models/PortfolioPosition";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const items = await PortfolioPosition.find({ userId: (session.user as { id: string }).id })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { symbol, name, quantity, buyPrice } = await req.json();
  if (!symbol || !name || !quantity || !buyPrice) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }
  if (quantity <= 0 || buyPrice <= 0) {
    return NextResponse.json({ error: "Quantity and price must be positive" }, { status: 400 });
  }

  await connectDB();
  const position = await PortfolioPosition.create({
    userId: (session.user as { id: string }).id,
    symbol,
    name,
    quantity: Number(quantity),
    buyPrice: Number(buyPrice),
  });

  return NextResponse.json(position, { status: 201 });
}
