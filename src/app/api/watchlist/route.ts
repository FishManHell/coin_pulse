import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/lib/auth-config";
import connectDB from "@/shared/lib/db";
import WatchlistItem from "../../../../models/WatchlistItem";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const items = await WatchlistItem.find({ userId: (session.user as { id: string }).id })
    .sort({ addedAt: -1 })
    .lean();

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { symbol, name } = await req.json();
  if (!symbol || !name) return NextResponse.json({ error: "symbol and name required" }, { status: 400 });

  await connectDB();

  const item = await WatchlistItem.findOneAndUpdate(
    { userId: (session.user as { id: string }).id, symbol },
    { userId: (session.user as { id: string }).id, symbol, name, addedAt: new Date() },
    { upsert: true, new: true }
  );

  return NextResponse.json(item, { status: 201 });
}
