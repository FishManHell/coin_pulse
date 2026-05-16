import binancePairs from "./pairs.generated.json";

// Reference data snapshotted at build time by scripts/generate-binance-pairs.mjs.
// Avoids fetching the 22MB exchangeInfo response at runtime (exceeds Next data
// cache 2MB per-item limit and would re-download on every revalidation).
export const tradingPairs = new Map<string, string>(binancePairs as [string, string][]);
