import { NextResponse } from "next/server";
import { requireApiUser } from "@/entities/user/lib/require-api-user";
import connectDB from "@/shared/lib/db";
import WatchlistItem from "../../../../models/WatchlistItem";

export async function GET() {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  await connectDB();
  const items = await WatchlistItem.find({ userId: auth.user.id })
    .sort({ addedAt: -1 })
    .lean();

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  const { symbol, name } = await req.json();
  if (!symbol || !name) return NextResponse.json({ error: "symbol and name required" }, { status: 400 });

  await connectDB();

  const item = await WatchlistItem.findOneAndUpdate(
    { userId: auth.user.id, symbol },
    { userId: auth.user.id, symbol, name, addedAt: new Date() },
    { upsert: true, new: true }
  );

  return NextResponse.json(item, { status: 201 });
}
