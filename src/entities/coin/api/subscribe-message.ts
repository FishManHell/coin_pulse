/**
 * Payload shapes for Binance combined-stream control frames. The wire format
 * is fixed by Binance — we just wrap it in tiny constructors so reconcile()
 * stays expression-level and the `id` correlation stays the caller's choice.
 *
 * @see https://github.com/binance/binance-spot-api-docs/blob/master/web-socket-streams.md#subscribe-to-a-stream
 */

export interface SubscribeMessage {
  method: "SUBSCRIBE";
  params: string[];
  id: number;
}

export interface UnsubscribeMessage {
  method: "UNSUBSCRIBE";
  params: string[];
  id: number;
}

export const streamName = (symbol: string): string => `${symbol.toLowerCase()}@ticker`;

export const subscribeMessage = (symbols: string[], id: number): SubscribeMessage => ({
  method: "SUBSCRIBE",
  params: symbols.map(streamName),
  id,
});

export const unsubscribeMessage = (symbols: string[], id: number): UnsubscribeMessage => ({
  method: "UNSUBSCRIBE",
  params: symbols.map(streamName),
  id,
});
