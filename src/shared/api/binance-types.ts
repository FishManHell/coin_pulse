/**
 * Binance WebSocket protocol types.
 *
 * Field names (single letters) are dictated by the Binance API and cannot be
 * renamed at this layer — they mirror the on-the-wire format. Mapping to
 * friendly domain types (e.g. CoinTicker) happens in dedicated parsers.
 *
 * @see https://github.com/binance/binance-spot-api-docs/blob/master/web-socket-streams.md
 */

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
