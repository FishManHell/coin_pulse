import { cn, formatPrice } from "@/shared/lib/utils";
import { styles } from "./styles";

interface PriceBodyProps {
  price: number;
  change: number;
}

export const PriceBody = ({ price, change }: Readonly<PriceBodyProps>) => {
  const isUp = change >= 0;

  return (
    <>
      <p className={styles.priceText}>${formatPrice(price)}</p>
      <p className={cn(styles.changeText, isUp ? styles.changeUp : styles.changeDown)}>
        {isUp ? "+" : ""}
        {formatPrice(Math.abs(change))} today
      </p>
    </>
  );
};
