// Snapshots Binance spot trading pairs to a committed JSON artifact, so the
// 22MB exchangeInfo response never has to be fetched at runtime.
//
// Runs as `prebuild` (yarn build → prebuild → next build). On fetch failure,
// keeps the existing snapshot to avoid breaking deploys on transient outages.

import { writeFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const SOURCE = "https://data-api.binance.vision/api/v3/exchangeInfo";
const OUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../src/shared/api/binance-pairs.generated.json",
);

try {
  const res = await fetch(SOURCE);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const { symbols } = await res.json();
  const pairs = symbols
    .filter((s) => s.status === "TRADING")
    .map((s) => [s.symbol, s.quoteAsset]);

  await writeFile(OUT, JSON.stringify(pairs));
  console.log(`[binance-pairs] wrote ${pairs.length} pairs`);
} catch (err) {
  try {
    await access(OUT);
    console.warn(
      `[binance-pairs] fetch failed (${err.message}); keeping existing snapshot`,
    );
  } catch {
    console.error(`[binance-pairs] fetch failed and no snapshot exists: ${err.message}`);
    process.exit(1);
  }
}
