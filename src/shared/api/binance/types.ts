/**
 * Binance API protocol types — both WebSocket streams and REST responses.
 *
 * Field names (single letters in WS payloads, positional in REST kline arrays)
 * are dictated by the Binance API and cannot be renamed at this layer — they
 * mirror the on-the-wire format. Mapping to friendly domain types (e.g.
 * CoinTicker, Kline) happens in dedicated parsers.
 *
 * @see https://github.com/binance/binance-spot-api-docs/blob/master/web-socket-streams.md
 * @see https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md
 */

// ── REST ─────────────────────────────────────────────────────────────────────

/**
 * Trimmed payload of `/ticker/24hr?type=MINI` — the subset of fields we read.
 */
export interface MiniTicker {
  symbol: string;
  lastPrice: string;
  quoteVolume: string;
}

/**
 * Full payload of `/ticker/24hr` — used for snapshot fetches that need the
 * same shape as the WebSocket ticker event.
 */
export interface FullTicker {
  symbol: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  volume: string;
  highPrice: string;
  lowPrice: string;
}

/**
 * One row of `/klines?…` — Binance returns positional tuples with mixed
 * primitive types. Timestamps are numeric (ms epoch), prices and volumes
 * are stringified decimals to preserve precision over the wire.
 */
export type BinanceKline = [
  openTime: number,
  open: string,
  high: string,
  low: string,
  close: string,
  volume: string,
  closeTime: number,
  quoteAssetVolume: string,
  trades: number,
  takerBuyBaseVolume: string,
  takerBuyQuoteVolume: string,
  ignore: string,
];

// ── WebSocket ────────────────────────────────────────────────────────────────

/**
 * Payload of the "Individual Symbol Ticker" stream (`<symbol>@ticker`).
 * 24-hour rolling window statistics — pushed every ~1s per symbol.
 */
export interface BinanceTickerEvent {
  /** Symbol, e.g. "BTCUSDT" */
  s: string;
  /** Last (close) price */
  c: string;
  /** Price change percent over the 24h window */
  P: string;
  /** Absolute price change over the 24h window */
  p: string;
  /** Total traded base-asset volume over the 24h window */
  v: string;
  /** Highest price in the 24h window */
  h: string;
  /** Lowest price in the 24h window */
  l: string;
}

/**
 * Envelope wrapper used when subscribing to combined streams
 * (`/stream?streams=a@ticker/b@ticker`). Single-stream connections deliver
 * the payload directly without this wrapper.
 */
export interface BinanceStreamEnvelope<T> {
  stream: string;
  data: T;
}
