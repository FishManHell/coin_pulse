import { cache } from "react";
import connectDB from "@/shared/lib/db";
import PortfolioModel from "./portfolio-position";
import { toPortfolioDTO } from "../serializers";
import type { PortfolioPosition } from "../types";

export const getPortfolioPositions = cache(
  async (userId: string): Promise<PortfolioPosition[]> => {
    await connectDB();
    const raw = await PortfolioModel.find({ userId }).sort({ createdAt: -1 }).lean();
    return raw.map(toPortfolioDTO);
  },
);
