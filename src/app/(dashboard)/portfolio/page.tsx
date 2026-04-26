import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/entities/user/lib/auth-config";
import connectDB from "@/shared/lib/db";
import PortfolioPosition from "../../../../models/PortfolioPosition";
import { Header } from "@/widgets/header";
import { PortfolioTable } from "@/widgets/portfolio-table";
import type { PortfolioPosition as PortfolioPositionType } from "@/shared/types";

const PortfolioPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  await connectDB();
  const rawPositions = await PortfolioPosition.find({
    userId: (session.user as { id: string }).id,
  })
    .sort({ createdAt: -1 })
    .lean();

  const positions: PortfolioPositionType[] = rawPositions.map((p) => ({
    id: p._id.toString(),
    symbol: p.symbol,
    name: p.name,
    quantity: p.quantity,
    buyPrice: p.buyPrice,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <>
      <Header title="Portfolio" showSearch={false} />
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-text-primary">Your portfolio</h2>
          <p className="text-text-muted text-sm mt-1">
            {positions.length} {positions.length === 1 ? "position" : "positions"}
          </p>
        </div>
        <PortfolioTable initialPositions={positions} />
      </div>
    </>
  );
}

export default PortfolioPage;
