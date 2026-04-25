"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, TrendingUp, TrendingDown, Briefcase } from "lucide-react";
import { useAppStore } from "@/shared/store";
import { usePriceStream } from "@/shared/hooks/usePriceStream";
import { useAddToPortfolio } from "@/features/add-to-portfolio";
import { useRemoveFromPortfolio } from "@/features/remove-from-portfolio";
import { formatPrice, formatPercent, cn } from "@/shared/lib/utils";
import type { PortfolioPosition } from "@/shared/types";

const COMMON_COINS = [
  { symbol: "BTCUSDT", name: "Bitcoin" },
  { symbol: "ETHUSDT", name: "Ethereum" },
  { symbol: "BNBUSDT", name: "BNB" },
  { symbol: "SOLUSDT", name: "Solana" },
  { symbol: "XRPUSDT", name: "XRP" },
  { symbol: "ADAUSDT", name: "Cardano" },
  { symbol: "DOGEUSDT", name: "Dogecoin" },
  { symbol: "AVAXUSDT", name: "Avalanche" },
];

type Props = { initialPositions: PortfolioPosition[] };

export const PortfolioTable = ({ initialPositions }: Readonly<Props>) => {
  const setPortfolio = useAppStore((s) => s.setPortfolio);
  const portfolio = useAppStore((s) => s.portfolio);
  const prices = useAppStore((s) => s.prices);
  const { remove, loading: removing } = useRemoveFromPortfolio();
  const { add, loading: adding, error: addError } = useAddToPortfolio();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ symbol: "BTCUSDT", name: "Bitcoin", quantity: "", buyPrice: "" });

  useEffect(() => { setPortfolio(initialPositions); }, []);

  const symbols = [...new Set(portfolio.map((p) => p.symbol))];
  usePriceStream(symbols);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await add({
      symbol: form.symbol,
      name: form.name,
      quantity: Number(form.quantity),
      buyPrice: Number(form.buyPrice),
    });
    if (ok) { setShowForm(false); setForm({ symbol: "BTCUSDT", name: "Bitcoin", quantity: "", buyPrice: "" }); }
  };

  // Summary stats
  const totalInvested = portfolio.reduce((s, p) => s + p.quantity * p.buyPrice, 0);
  const totalCurrent = portfolio.reduce((s, p) => {
    const price = prices[p.symbol]?.price ?? p.buyPrice;
    return s + p.quantity * price;
  }, 0);
  const totalPnl = totalCurrent - totalInvested;
  const totalPnlPct = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
  const isPnlUp = totalPnl >= 0;

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      {portfolio.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Invested", value: `$${formatPrice(totalInvested)}`, color: "text-text-primary" },
            { label: "Current value", value: `$${formatPrice(totalCurrent)}`, color: "text-text-primary" },
            {
              label: "Total P&L",
              value: `${isPnlUp ? "+" : ""}$${formatPrice(Math.abs(totalPnl))} (${formatPercent(totalPnlPct)})`,
              color: isPnlUp ? "text-price-up" : "text-price-down",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-surface border border-border-base rounded-2xl p-4">
              <p className="text-xs text-text-muted mb-1">{label}</p>
              <p className={cn("text-lg font-bold", color)}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="bg-surface border border-border-base rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-base">
          <h3 className="text-sm font-semibold text-text-primary">Positions</h3>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-medium gradient-accent text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus size={13} /> Add position
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <form onSubmit={handleAdd} className="px-5 py-4 border-b border-border-base bg-bg">
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-text-muted mb-1">Coin</label>
                <select
                  value={form.symbol}
                  onChange={(e) => {
                    const coin = COMMON_COINS.find((c) => c.symbol === e.target.value);
                    setForm((f) => ({ ...f, symbol: e.target.value, name: coin?.name ?? "" }));
                  }}
                  className="w-full bg-surface border border-border-base rounded-xl px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-indigo"
                >
                  {COMMON_COINS.map((c) => (
                    <option key={c.symbol} value={c.symbol}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">Quantity</label>
                <input
                  type="number" step="any" min="0" required
                  placeholder="0.5"
                  value={form.quantity}
                  onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                  className="w-full bg-surface border border-border-base rounded-xl px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-indigo"
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">Buy price ($)</label>
                <input
                  type="number" step="any" min="0" required
                  placeholder="42000"
                  value={form.buyPrice}
                  onChange={(e) => setForm((f) => ({ ...f, buyPrice: e.target.value }))}
                  className="w-full bg-surface border border-border-base rounded-xl px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-indigo"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="submit" disabled={adding}
                  className="flex-1 gradient-accent text-white text-sm font-medium rounded-xl py-2 hover:opacity-90 disabled:opacity-50"
                >
                  {adding ? "…" : "Add"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-3 py-2 text-sm text-text-muted hover:text-text-primary border border-border-base rounded-xl"
                >
                  ✕
                </button>
              </div>
            </div>
            {addError && <p className="text-price-down text-xs mt-2">{addError}</p>}
          </form>
        )}

        {portfolio.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Briefcase size={36} className="text-text-muted mb-3" />
            <p className="text-text-primary font-medium mb-1">No positions yet</p>
            <p className="text-text-muted text-sm">Click "Add position" to start tracking.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_110px_110px_110px_130px_52px] px-5 py-3 border-b border-border-base">
              {["Asset", "Qty", "Buy price", "Current", "P&L", ""].map((h) => (
                <span key={h} className="text-xs font-medium text-text-muted uppercase tracking-wider">{h}</span>
              ))}
            </div>
            {portfolio.map((pos) => {
              const currentPrice = prices[pos.symbol]?.price ?? pos.buyPrice;
              const pnl = (currentPrice - pos.buyPrice) * pos.quantity;
              const pnlPct = ((currentPrice - pos.buyPrice) / pos.buyPrice) * 100;
              const up = pnl >= 0;

              return (
                <div key={pos.id} className="grid grid-cols-[1fr_110px_110px_110px_130px_52px] items-center px-5 py-4 border-b border-border-base last:border-0 hover:bg-surface-hover transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {pos.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{pos.name}</p>
                      <p className="text-xs text-text-muted">{pos.symbol.replace("USDT", "")}</p>
                    </div>
                  </div>
                  <span className="text-sm text-text-secondary">{pos.quantity}</span>
                  <span className="text-sm text-text-secondary">${formatPrice(pos.buyPrice)}</span>
                  <span className="text-sm text-text-primary">${formatPrice(currentPrice)}</span>
                  <span className={cn("flex items-center gap-1 text-sm font-medium", up ? "text-price-up" : "text-price-down")}>
                    {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {up ? "+" : ""}${formatPrice(Math.abs(pnl))}
                    <span className="text-xs opacity-70">({formatPercent(pnlPct)})</span>
                  </span>
                  <button
                    onClick={() => remove(pos.id)} disabled={removing}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-price-down hover:bg-price-down/10 transition-all disabled:opacity-40"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};
