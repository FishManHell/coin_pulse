import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createMarketSlice } from "./slices/market-slice";
import { createUserDataSlice } from "./slices/user-data-slice";
import { createSelectionSlice } from "./slices/selection-slice";
import type { AppStore } from "./types";

export const useAppStore = create<AppStore>()(
  devtools(
    (...a) => ({
      ...createMarketSlice(...a),
      ...createUserDataSlice(...a),
      ...createSelectionSlice(...a),
    }),
    { name: "coinpulse", enabled: process.env.NODE_ENV !== "production" },
  ),
);
