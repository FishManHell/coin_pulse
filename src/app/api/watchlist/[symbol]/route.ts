import { NextResponse } from "next/server";
import { requireApiUser } from "@/entities/user/lib/require-api-user";
import connectDB from "@/shared/lib/db";
import WatchlistItem from "@/models/WatchlistItem";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  const { symbol } = await params;
  await connectDB();

  const result = await WatchlistItem.deleteOne({
    userId: auth.user.id,
    symbol,
  });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Removed" });
}
