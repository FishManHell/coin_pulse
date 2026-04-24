"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/shared/store";
import type { CoinTicker } from "@/shared/types";

const BINANCE_WS = "wss://stream.binance.com:9443";

type BinanceTicker = {
  s: string;
  c: string;
  P: string;
  p: string;
  v: string;
  h: string;
  l: string;
};

const parseTicker = (raw: BinanceTicker): CoinTicker => ({
  symbol: raw.s,
  name: raw.s.replace("USDT", ""),
  price: parseFloat(raw.c),
  priceChange: parseFloat(raw.p),
  priceChangePercent: parseFloat(raw.P),
  volume: parseFloat(raw.v),
  high24h: parseFloat(raw.h),
  low24h: parseFloat(raw.l),
});

export const useWebSocket = (symbols: string[]) => {
  const wsRef = useRef<WebSocket | null>(null);
  const updatePrice = useAppStore((s) => s.updatePrice);

  useEffect(() => {
    if (!symbols.length) return;

    let cancelled = false;

    const streams = symbols.map((s) => `${s.toLowerCase()}@ticker`).join("/");
    const url = `${BINANCE_WS}/stream?streams=${streams}`;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      // If cleanup already ran — close immediately instead of keeping connection
      if (cancelled) ws.close();
    };

    ws.onmessage = (event) => {
      if (cancelled) return;
      const msg = JSON.parse(event.data);
      const data: BinanceTicker = msg.data ?? msg;
      if (data?.s) updatePrice(parseTicker(data));
    };

    ws.onerror = () => ws.close();

    ws.onclose = () => {
      wsRef.current = null;
    };

    return () => {
      cancelled = true;
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      } else {
        // Still connecting — override onopen to close when ready
        ws.onopen = () => ws.close();
      }
    };
  }, [symbols.join(",")]);
};
