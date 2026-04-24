export type CoinMeta = { symbol: string; name: string };

export const COINS_LIST: CoinMeta[] = [
  { symbol: "BTCUSDT",  name: "Bitcoin" },
  { symbol: "ETHUSDT",  name: "Ethereum" },
  { symbol: "BNBUSDT",  name: "BNB" },
  { symbol: "SOLUSDT",  name: "Solana" },
  { symbol: "XRPUSDT",  name: "XRP" },
  { symbol: "ADAUSDT",  name: "Cardano" },
  { symbol: "DOGEUSDT", name: "Dogecoin" },
  { symbol: "AVAXUSDT", name: "Avalanche" },
  { symbol: "DOTUSDT",  name: "Polkadot" },
  { symbol: "MATICUSDT",name: "Polygon" },
  { symbol: "LINKUSDT", name: "Chainlink" },
  { symbol: "UNIUSDT",  name: "Uniswap" },
  { symbol: "LTCUSDT",  name: "Litecoin" },
  { symbol: "ATOMUSDT", name: "Cosmos" },
  { symbol: "ETCUSDT",  name: "Ethereum Classic" },
  { symbol: "XLMUSDT",  name: "Stellar" },
  { symbol: "TRXUSDT",  name: "TRON" },
  { symbol: "NEARUSDT", name: "NEAR Protocol" },
  { symbol: "APTUSDT",  name: "Aptos" },
  { symbol: "ARBUSDT",  name: "Arbitrum" },
  { symbol: "OPUSDT",   name: "Optimism" },
  { symbol: "INJUSDT",  name: "Injective" },
  { symbol: "SUIUSDT",  name: "Sui" },
  { symbol: "SEIUSDT",  name: "Sei" },
  { symbol: "FILUSDT",  name: "Filecoin" },
];

export const searchCoins = (query: string): CoinMeta[] => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return COINS_LIST.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.symbol.toLowerCase().includes(q)
  ).slice(0, 6);
};
