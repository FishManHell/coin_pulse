import type { BinanceStreamEnvelope, BinanceTickerEvent } from "@/shared/api/binance/types";
import { parseTicker } from "@/shared/api/binance/stream-parse";
import type { CoinTicker } from "../types";

const RECONNECT_DELAY_MS = 5000;

export interface TickerSocketHandlers {
  onTicker: (ticker: CoinTicker) => void;
  /**
   * Fired after an unintended drop has been debounced (5s). The caller is
   * responsible for issuing the actual `connect()` call — this module owns
   * the transport, not the subscription policy.
   */
  onReconnectNeeded: () => void;
}

export interface TickerSocket {
  connect(url: string): void;
  disconnect(): void;
  send(payload: object): void;
}

export const createTickerSocket = (handlers: TickerSocketHandlers): TickerSocket => {
  let socket: WebSocket | null = null;
  let pendingMessages: string[] = [];
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
      handlers.onReconnectNeeded();
    }, RECONNECT_DELAY_MS);
  };

  const disconnect = () => {
    clearReconnectTimer();
    if (!socket) return;
    const closing = socket;
    socket = null;
    pendingMessages = [];
    closing.onmessage = null;
    closing.onclose = null;
    closing.onopen = null;

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

  const connect = (url: string) => {
    if (socket) disconnect();

    const nextSocket = new WebSocket(url);

    nextSocket.onopen = () => {
      if (nextSocket !== socket) return;
      for (const msg of pendingMessages) nextSocket.send(msg);
      pendingMessages = [];
    };

    nextSocket.onmessage = (event) => {
      // Ignore late messages from a socket that's already been replaced.
      if (nextSocket !== socket) return;
      const payload = JSON.parse(event.data) as BinanceStreamEnvelope<BinanceTickerEvent>;
      const ticker = payload.data;
      // Ack frames ({result:null,id} / {error,id}) have no `data` and slip past
      // this guard silently — they carry no state we need on the client.
      if (ticker?.s) handlers.onTicker(parseTicker(ticker));
    };

    // Recovery path. Intentional `disconnect()` nulls this handler first, so it
    // only fires for genuine drops (network blip, Binance restart, etc.).
    // `error` is followed by `close` per the WebSocket spec — routing all
    // recovery through `close` keeps a single path.
    nextSocket.onclose = () => {
      if (nextSocket !== socket) return;
      socket = null;
      pendingMessages = [];
      scheduleReconnect();
    };

    socket = nextSocket;
  };

  const send = (payload: object) => {
    if (!socket) return;
    const json = JSON.stringify(payload);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(json);
    } else if (socket.readyState === WebSocket.CONNECTING) {
      pendingMessages.push(json);
    }
    // CLOSING / CLOSED: drop. The caller will reissue full state after the next
    // onReconnectNeeded → connect() cycle.
  };

  return { connect, disconnect, send };
};
