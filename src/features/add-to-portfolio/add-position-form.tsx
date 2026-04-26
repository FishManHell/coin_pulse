"use client";

import { X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { CoinCombobox } from "@/features/coin-combobox";
import { usePositionForm } from "./use-position-form";
import { styles } from "./styles";

type Props = { onCloseAction: () => void };

export const AddPositionForm = ({ onCloseAction }: Props) => {
  const { fields, set, submit, loading, error, noPairs } = usePositionForm({ onSuccess: onCloseAction });

  return (
    <form onSubmit={submit} className={styles.formWrap}>
      <div className={styles.formGrid}>
        <div>
          <label className={styles.fieldLabel}>Coin</label>
          <CoinCombobox
            value={fields.symbol}
            onChange={(coin) => set("symbol", coin.symbol)}
            disabled={noPairs}
            placeholder={noPairs ? "Loading…" : "Select coin"}
          />
        </div>
        <div>
          <label className={styles.fieldLabel}>Quantity</label>
          <input
            type="number" step="any" min="0" required
            placeholder="0.5"
            value={fields.quantity}
            onChange={(e) => set("quantity", e.target.value)}
            className={styles.fieldInput}
          />
        </div>
        <div>
          <label className={styles.fieldLabel}>Buy price ($)</label>
          <input
            type="number" step="any" min="0" required
            placeholder="42000"
            value={fields.buyPrice}
            onChange={(e) => set("buyPrice", e.target.value)}
            className={styles.fieldInput}
          />
        </div>
        <div className="flex items-end gap-2">
          <Button type="submit" variant="gradient" disabled={loading || noPairs} className="flex-1">
            {loading ? "…" : "Add"}
          </Button>
          <Button type="button" variant="outline" size="icon" onClick={onCloseAction} aria-label="Cancel">
            <X />
          </Button>
        </div>
      </div>
      {error && <p className={styles.formError}>{error}</p>}
    </form>
  );
};
