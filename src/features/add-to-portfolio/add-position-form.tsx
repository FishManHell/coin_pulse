"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { CoinCombobox } from "@/features/coin-combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { usePositionForm } from "./use-position-form";
import { styles } from "./styles";

export const AddPositionForm = ({ onCloseAction }: { onCloseAction: () => void }) => {
  const t = useTranslations("portfolio.form");
  const {
    fields,
    set,
    submit,
    loading,
    noPairs,
    quote,
    setQuote,
    quotes,
    pairs
  } = usePositionForm({ onSuccessAction: onCloseAction });

  return (
    <form onSubmit={submit} className={styles.formWrap}>
      <div className={styles.formGrid}>
        <div>
          <label className={styles.fieldLabel}>{t("coin")}</label>
          <CoinCombobox
            value={fields.symbol}
            onChange={(coin) => set("symbol", coin.symbol)}
            pairs={pairs}
            quote={quote}
            disabled={noPairs}
            placeholder={noPairs ? t("loadingPairs") : t("selectCoin")}
          />
        </div>
        <div>
          <label className={styles.fieldLabel}>{t("pair")}</label>
          <Select value={quote} onValueChange={setQuote}>
            <SelectTrigger className="w-full bg-surface border-border-base h-[38px] rounded-xl text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-surface border-border-base">
              {quotes.map((q) => (
                <SelectItem key={q} value={q} className="text-sm cursor-pointer">{q}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className={styles.fieldLabel}>{t("quantity")}</label>
          <input
            type="number" step="any" min="0" required
            placeholder="0.5"
            value={fields.quantity}
            onChange={(e) => set("quantity", e.target.value)}
            className={styles.fieldInput}
          />
        </div>
        <div>
          <label className={styles.fieldLabel}>{t("buyPrice")}</label>
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
            {loading ? "…" : t("submit")}
          </Button>
          <Button type="button" variant="outline" size="icon" onClick={onCloseAction} aria-label={t("cancel")}>
            <X />
          </Button>
        </div>
      </div>
    </form>
  );
};
