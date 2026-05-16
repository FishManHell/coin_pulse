import { NextResponse } from "next/server";
import { requireApiUser } from "@/entities/user/lib/require-api-user";
import connectDB from "@/shared/lib/db";
import PortfolioPosition from "@/entities/portfolio/model/portfolio-position";
import { ERRORS } from "@/shared/lib/api-response";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  await connectDB();

  const result = await PortfolioPosition.deleteOne({
    _id: id,
    userId: auth.user.id,
  });

  if (result.deletedCount === 0) return ERRORS.notFound();

  return NextResponse.json({ message: "Deleted" });
}
