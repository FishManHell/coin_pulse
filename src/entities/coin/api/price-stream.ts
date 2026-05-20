import { buildStreamUrl } from "@/shared/api/binance/stream-parse";
import { usePricesStore } from "../model/store";
import { createTickerSocket } from "./binance-ticker-socket";
import { RefCountedSet } from "./ref-counted-set";
import { diffSymbols } from "./diff-symbols";
import { subscribeMessage, unsubscribeMessage } from "./subscribe-message";

const refs = new RefCountedSet<string>();
let subscribedSymbols: string[] = [];
let nextRequestId = 1;
let reconcileScheduled = false;

const socket = createTickerSocket({
  onTicker: (ticker) => usePricesStore.getState().updatePrice(ticker),
  onReconnectNeeded: () => {
    // Drop signal arrived from transport. Clearing `subscribedSymbols` makes
    // reconcile take the cold-open branch (URL with seed streams), which is
    // strictly more efficient than reopening with `[]` and then SUBSCRIBE-ing.
    subscribedSymbols = [];
    scheduleReconcile();
  },
});

const reconcile = () => {
  reconcileScheduled = false;
  const desired = refs.keys();

  if (desired.length === 0) {
    socket.disconnect();
    subscribedSymbols = [];
    return;
  }

  if (subscribedSymbols.length === 0) {
    // Cold open OR reopen after drop. The URL carries the full set as seed
    // streams so Binance starts pushing immediately, no follow-up SUBSCRIBE.
    socket.connect(buildStreamUrl(desired));
    subscribedSymbols = desired;
    return;
  }

  const { add, remove } = diffSymbols(subscribedSymbols, desired);
  if (add.length === 0 && remove.length === 0) return;

  if (add.length > 0) socket.send(subscribeMessage(add, nextRequestId++));
  if (remove.length > 0) socket.send(unsubscribeMessage(remove, nextRequestId++));

  subscribedSymbols = desired;
};

const scheduleReconcile = () => {
  if (reconcileScheduled) return;
  reconcileScheduled = true;
  // Microtask coalesces sync mount/unmount cycles (StrictMode, parallel hooks)
  // into a single SUB/UNSUB pair instead of one per ref change.
  queueMicrotask(reconcile);
};

export const subscribe = (symbols: string[]): (() => void) => {
  if (typeof window === "undefined" || symbols.length === 0) return () => {};

  refs.increment(symbols);
  scheduleReconcile();

  return () => {
    refs.decrement(symbols);
    scheduleReconcile();
  };
};
