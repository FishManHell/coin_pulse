import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { ROUTES } from "@/shared/config/routes";
import { styles } from "./styles";

export const SidebarLogo = () => (
  <div className={styles.logoSection}>
    <Link href={ROUTES.dashboard} className={styles.logoLink}>
      <div className={styles.logoBadge}>
        <TrendingUp size={16} className="text-white" />
      </div>
      <span className={styles.logoText}>CoinPulse</span>
    </Link>
  </div>
);
