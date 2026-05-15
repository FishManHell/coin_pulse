import { useAppStore } from "@/shared/store";
import type { BinanceStreamEnvelope, BinanceTickerEvent } from "./binance-types";
import { buildStreamUrl, parseTicker } from "./binance-stream-parse";

const RECONNECT_DELAY_MS = 5000;

// ─── Connection lifecycle ────────────────────────────────────────────────────

let activeSocket: WebSocket | null = null;
let activeSymbols: string[] = [];
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

const clearReconnectTimer = () => {
  if (reconnectTimer === null) return;
  clearTimeout(reconnectTimer);
  reconnectTimer = null;
};

const scheduleReconnect = () => {
  if (reconnectTimer !== null) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    if (refCounts.size > 0) scheduleReconcile();
  }, RECONNECT_DELAY_MS);
};

const closeActiveSocket = () => {
  clearReconnectTimer();
  if (!activeSocket) return;
  const closing = activeSocket;
  activeSocket = null;
  closing.onmessage = null;
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
    // Combined-stream endpoint always wraps payloads in the envelope shape.
    const payload = JSON.parse(event.data) as BinanceStreamEnvelope<BinanceTickerEvent>;
    const ticker = payload.data;
    if (ticker?.s) useAppStore.getState().updatePrice(parseTicker(ticker));
  };

  // Recovery path. Intentional closes null this handler first, so it only fires
  // for genuine drops (network blip, Binance restart, etc.). `error` is followed
  // by `close` per the WebSocket spec — routing all recovery through `close`
  // keeps a single path. Clearing activeSymbols forces the next reconcile to
  // detect a delta and reopen.
  nextSocket.onclose = () => {
    if (nextSocket !== activeSocket) return;
    activeSocket = null;
    activeSymbols = [];
    scheduleReconnect();
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
