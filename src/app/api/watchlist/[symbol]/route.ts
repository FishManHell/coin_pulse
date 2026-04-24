import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/lib/auth-config";
import connectDB from "@/shared/lib/db";
import WatchlistItem from "../../../../../models/WatchlistItem";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { symbol } = await params;
  await connectDB();

  const result = await WatchlistItem.deleteOne({
    userId: (session.user as { id: string }).id,
    symbol,
  });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Removed" });
}
