import type { MarketSlice } from "./slices/market-slice";
import type { UserDataSlice } from "./slices/user-data-slice";
import type { SelectionSlice } from "./slices/selection-slice";

export type AppStore = MarketSlice & UserDataSlice & SelectionSlice;

export type StoreMutators = [["zustand/devtools", never]];
