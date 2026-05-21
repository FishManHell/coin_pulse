"use client";

import { useTranslations } from "next-intl";
import { usePriceStream } from "@/entities/coin";
import { SkeletonCard } from "./SkeletonCard";
import { EmptyState } from "./EmptyState";
import { LivePriceCard } from "./LivePriceCard";
import { useTopCoins } from "./use-top-coins";
import { styles } from "./styles";

const SKELETON_COUNT = 6;

export const MarketOverview = ({ initialSymbols }: { initialSymbols: string[] }) => {
  const { symbols, fetching, timedOut } = useTopCoins(initialSymbols);
  usePriceStream(symbols);
  const t = useTranslations("dashboard.marketOverview");

  const renderContent = () => {
    if (fetching) {
      return Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <div key={i} className={styles.snapItem}>
          <SkeletonCard />
        </div>
      ));
    }
    if (symbols.length === 0) return <EmptyState />;
    return symbols.map((s) => (
      <div key={s} className={styles.snapItem}>
        <LivePriceCard symbol={s} timedOut={timedOut} />
      </div>
    ));
  };

  return (
    <section>
      <div className={styles.headerRow}>
        <div>
          <p className={styles.eyebrow}>{t("eyebrow")}</p>
          <h2 className={styles.title}>{t("title")}</h2>
        </div>
        <span className={styles.liveRow}>
          <span className={styles.liveDot} />
          {t("live")}
        </span>
      </div>

      <div className={styles.grid}>{renderContent()}</div>
    </section>
  );
};
