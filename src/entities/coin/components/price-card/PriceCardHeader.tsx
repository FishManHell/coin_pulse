import { CoinIcon } from "@/shared/ui/coin-icon";
import { styles } from "./styles";

type Props = {
  base: string;
  quote: string;
  displayName: string;
};

export const PriceCardHeader = ({ base, quote, displayName }: Readonly<Props>) => (
  <div className={styles.headerInfo}>
    <CoinIcon base={base} size="md" />
    <div className={styles.headerText}>
      <p className={styles.coinName}>{displayName}</p>
      <p className={styles.coinTicker}>
        {base}/{quote}
      </p>
    </div>
  </div>
);
