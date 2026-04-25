import { useAppStore } from "@/shared/store";
import type { CoinTicker } from "@/shared/types";
import type { BinanceTickerEvent, BinanceStreamEnvelope } from "./binance-types";

const BINANCE_WS_BASE = "wss://stream.binance.com:9443";

// ─── Parsing ─────────────────────────────────────────────────────────────────

const parseTicker = (event: BinanceTickerEvent): CoinTicker => ({
  symbol: event.s,
  price: parseFloat(event.c),
  priceChange: parseFloat(event.p),
  priceChangePercent: parseFloat(event.P),
  volume: parseFloat(event.v),
  high24h: parseFloat(event.h),
  low24h: parseFloat(event.l),
});

const buildStreamUrl = (symbols: string[]): string => {
  const streams = symbols.map((s) => `${s.toLowerCase()}@ticker`).join("/");
  return `${BINANCE_WS_BASE}/stream?streams=${streams}`;
};

// ─── Connection lifecycle ────────────────────────────────────────────────────

let activeSocket: WebSocket | null = null;
let activeSymbols: string[] = [];

const closeActiveSocket = () => {
  if (!activeSocket) return;
  const closing = activeSocket;
  activeSocket = null;
  closing.onmessage = null;
  closing.onerror = null;
  closing.onclose = null;

  if (closing.readyState === WebSocket.CONNECTING) {
    // Closing during handshake produces a "closed before connection established"
    // browser warning. Defer the close until the socket actually opens.
    closing.onopen = () => closing.close();
    return;
  }

  if (closing.readyState === WebSocket.OPEN) {
    closing.close();
  }
};

const openSocket = (symbols: string[]) => {
  const nextSocket = new WebSocket(buildStreamUrl(symbols));

  nextSocket.onmessage = (event) => {
    // Ignore late messages from a socket that's already been replaced.
    if (nextSocket !== activeSocket) return;
    const payload = JSON.parse(event.data) as BinanceStreamEnvelope<BinanceTickerEvent> | BinanceTickerEvent;
    const ticker = "data" in payload ? payload.data : payload;
    if (ticker?.s) useAppStore.getState().updatePrice(parseTicker(ticker));
  };

  nextSocket.onerror = () => {
    if (nextSocket === activeSocket) closeActiveSocket();
  };

  activeSocket = nextSocket;
};

// ─── Reconciliation ──────────────────────────────────────────────────────────

const refCounts = new Map<string, number>();
let reconcileScheduled = false;

const sameList = (a: string[], b: string[]) =>
  a.length === b.length && a.every((s, i) => s === b[i]);

const reconcile = () => {
  reconcileScheduled = false;
  const desired = Array.from(refCounts.keys()).sort();

  if (sameList(desired, activeSymbols)) return;

  closeActiveSocket();
  activeSymbols = desired;
  if (desired.length > 0) openSocket(desired);
};

const scheduleReconcile = () => {
  if (reconcileScheduled) return;
  reconcileScheduled = true;
  // Microtask coalesces sync mount/unmount cycles (e.g. StrictMode, parallel hooks).
  queueMicrotask(reconcile);
};

const incrementRefs = (symbols: string[]) => {
  for (const s of symbols) {
    refCounts.set(s, (refCounts.get(s) ?? 0) + 1);
  }
};

const decrementRefs = (symbols: string[]) => {
  for (const s of symbols) {
    const next = (refCounts.get(s) ?? 0) - 1;
    if (next <= 0) refCounts.delete(s);
    else refCounts.set(s, next);
  }
};

// ─── Public API ──────────────────────────────────────────────────────────────

export const subscribe = (symbols: string[]): (() => void) => {
  if (typeof window === "undefined" || symbols.length === 0) return () => {};

  incrementRefs(symbols);
  scheduleReconcile();

  return () => {
    decrementRefs(symbols);
    scheduleReconcile();
  };
};
