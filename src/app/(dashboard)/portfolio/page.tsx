import { requireUser } from "@/entities/user/lib/require-user";
import connectDB from "@/shared/lib/db";
import PortfolioPosition from "@/entities/portfolio/model/portfolio-position";
import { toPortfolioDTO } from "@/entities/portfolio";
import { Header } from "@/widgets/header";
import { PortfolioTable } from "@/widgets/portfolio-table";

const PortfolioPage = async () => {
  const user = await requireUser();

  await connectDB();
  const rawPositions = await PortfolioPosition.find({ userId: user.id })
    .sort({ createdAt: -1 })
    .lean();

  const positions = rawPositions.map(toPortfolioDTO);

  return (
    <>
      <Header title="Portfolio" showSearch={false} />
      <div className="flex-1 p-6 flex flex-col min-h-0">
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
